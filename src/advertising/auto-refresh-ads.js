/**
 * When enabled, reloads ads when stream starts and every x minutes
 * while stream is playing.
 */
(function(window, undefined) {

	var scriptName = 'AUTO REFRESH ADS',
		nameSpace = 'autoRefreshAds',
		version = '0.2',

		// Time before refreshing ads, in minutes
		timeout = 6;

	// Only inject once
	if (window._CMLS[nameSpace]) {
		window._CMLS[nameSpace].restart();
		return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	window._CMLS[nameSpace] = {
		player: window._CMLS.whichPlayer(),
		timer: null,
		boundToRenderEvent: false,
		
		/**
		 * Check if we're on the homepage and auto-reloader is
		 * active on this site.
		 * @return {Boolean}
		 */
		checkConditions: function checkConditions() {
			if (
				window._CMLS.isHomepage() &&
				window._CMLS.autoReloader &&
				window._CMLS.autoReloader.active
			) {
				return false;
			}
			return true;
		},

		/**
		 * Stop timer and unbind from ad render
		 * @param {Function} callback Function to call after stopping
		 * @return {void}
		 */
		stop: function stop(callback) {
			log('Stopping timer.');
			clearTimeout(this.timer);
			this.timer = null;
			if (this.boundToRenderEvent) {
				this.unbindFromRenderEvent();
			}
			if (callback) {
				callback();
			}
		},

		/**
		 * Start timer, bind to ad render event
		 * @return {void}
		 */
		start: function start() {
			// Do not start if we're already running
			if (this.timer || this.active) {
				return;
			}

			var that = this;

			log('Starting timer.');
			this.timer = setTimeout(function() {
				that.fire();
			}, timeout * 60000);

			if ( ! this.boundToRenderEvent) {
				this.bindToRenderEvent();
			}
		},

		/**
		 * Restart timer
		 * @return {void}
		 */
		restart: function restart() {
			this.stop(this.start);
		},

		/**
		 * Fire reloader
		 * @return {void}
		 */
		fire: function fire() {
			// Don't fire if we're on the homepage and
			// auto-reloader is active.
			if ( ! this.checkConditions()) {
				log('Autoreloader is active, will not refresh ads.');
				this.stop();
				return;
			}
			
			if ( ! this.boundToRenderEvent) {
				this.bindToRenderEvent();
			}

			window.googletag.cmd.push(function() {
				log('Refreshing ads.');
				window.googletag.pubads().refresh();
			});

			// Stop here, let ad refresh restart timer
		},

		/**
		 * Restart timer when ads render
		 * @return {void}
		 */
		bindToRenderEvent: function bindToRenderEvent() {
			log('Binding to ad render event');
			var that = this;
			window.googletag.cmd.push(function() {
				window.googletag.pubads().addEventListener(
					'slotRenderEnded',
					that.restart
				);
				that.boundToRenderEvent = true;
			});
		},

		/**
		 * Remove restart from ad render event
		 * @return {void}
		 */
		unbindFromRenderEvent: function unbindFromRenderEvent() {
			log('Unbinding from ad render event.');
			var that = this;
			window.googletag.cmd.push(function() {
				window.googletag.pubads().removeEventListener(
					'slotRenderEnded',
					that.restart
				);
				that.boundToRenderEvent = false;
			});
		},

		/**
		 * Initialize listeners
		 * @return {void}
		 */
		init: function init() {
			log('Initializing.');
			var that = this;

			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];

			// Initialize listeners for Triton Player
			if (this.player.type === window._CMLS.const.PLAYER_TRITON) {

				window.addEventListener('td-player.stopped', function() {
					that.stop();
				}, false);
				window.addEventListener('td-player.playing', function() {
					that.start();
				}, false);

				// Clear timer when moving to another page
				if (window.History && window.History.Adapter) {
					window.History.Adapter.bind(window, 'statechange', function() {
						that.stop();
					});
				}

			}

			// Initialize listeners for TuneGenie Player
			if (this.player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
				if (window.tgmp && window.TGMP_EVENTS) {
					window.tgmp.addEventListener(window.TGMP_EVENTS.streamplaying, function(e) {
						if (e === true) {
							that.start();
							return;
						}
						that.stop();
					});
				}
			}

			log('Listeners set, waiting for player event.');
		}
	};

	// Don't initialize if conditions are bad.
	if ( ! window._CMLS[nameSpace].checkConditions()) {
		log('Autoreloader is active on this page, exiting.');
		return;
	}

	// If we've already parsed DFP, use that data, otherwise bind to event
	var initialized = false;
	function initTest() {
		for (var i = 0; i < window._CMLS.cGroups.length; i++) {
			if (
				/Format\s+(NewsTalk|Talk|Sports|Christian Talk)/i.test(window._CMLS.cGroups[i])
			) {
				log('Running initialization.');
				window._CMLS[nameSpace].init();
				initialized = true;
			}
		}
	}
	initTest();
	window.addEventListener('cms-sgroup', function() {
		if ( ! initialized) {
			initTest();
		}
	}, false);

}(window));