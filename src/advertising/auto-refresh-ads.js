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

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	// Only inject once
	if (window._CMLS[nameSpace]) {
		log('Script loaded while already active, restarting timer.');
		if ( ! window._CMLS[nameSpace].checkCondition()) {
			window._CMLS[nameSpace].stop();
		} else {
			window._CMLS[nameSpace].restart();
		}
		return;
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
		checkCondition: function checkCondition() {
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
			clearTimeout(window._CMLS[nameSpace].timer);
			window._CMLS[nameSpace].timer = null;
			if (window._CMLS[nameSpace].boundToRenderEvent) {
				window._CMLS[nameSpace].unbindFromRenderEvent();
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
			if (window._CMLS[nameSpace].timer) {
				return;
			}

			if ( ! window._CMLS[nameSpace].checkCondition()) {
				log('Condition check failed on start.');
				return;
			}

			log('Starting timer.');
			window._CMLS[nameSpace].timer = setTimeout(function() {
				window._CMLS[nameSpace].fire();
			}, timeout * 60000);

			if ( ! window._CMLS[nameSpace].boundToRenderEvent) {
				window._CMLS[nameSpace].bindToRenderEvent();
			}
		},

		/**
		 * Restart timer
		 * @return {void}
		 */
		restart: function restart() {
			window._CMLS[nameSpace].stop(window._CMLS[nameSpace].start);
		},

		/**
		 * Fire reloader
		 * @return {void}
		 */
		fire: function fire() {
			// Don't fire if we're on the homepage and
			// auto-reloader is active.
			if ( ! window._CMLS[nameSpace].checkCondition()) {
				log('Autoreloader is active, will not refresh ads.');
				window._CMLS[nameSpace].stop();
				return;
			}
			
			if ( ! window._CMLS[nameSpace].boundToRenderEvent) {
				window._CMLS[nameSpace].bindToRenderEvent();
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
			window.googletag.cmd.push(function() {
				window.googletag.pubads().addEventListener(
					'slotRenderEnded',
					window._CMLS[nameSpace].restart
				);
				window._CMLS[nameSpace].boundToRenderEvent = true;
			});
		},

		/**
		 * Remove restart from ad render event
		 * @return {void}
		 */
		unbindFromRenderEvent: function unbindFromRenderEvent() {
			log('Unbinding from ad render event.');
			window.googletag.cmd.push(function() {
				window.googletag.pubads().removeEventListener(
					'slotRenderEnded',
					window._CMLS[nameSpace].restart
				);
				window._CMLS[nameSpace].boundToRenderEvent = false;
			});
		},

		/**
		 * Initialize listeners
		 * @return {void}
		 */
		init: function init() {
			log('Initializing.');

			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];

			// Initialize listeners for Triton Player
			if (window._CMLS[nameSpace].player.type === window._CMLS.const.PLAYER_TRITON) {

				window.addEventListener('td-player.stopped', function() {
					window._CMLS[nameSpace].stop();
				}, false);
				
				window.addEventListener('td-player.playing', function() {
					window._CMLS[nameSpace].start();
				}, false);

				// Clear timer when moving to another page
				if (window.History && window.History.Adapter) {
					window.History.Adapter.bind(window, 'statechange', function() {
						log('Caught statechange.');
						window._CMLS[nameSpace].stop();
					});
					window.History.Adapter.bind(window, 'pageChange', function() {
						log('Caught pageChange.');
						window._CMLS[nameSpace].restart();
					});
				}

			}

			// Initialize listeners for TuneGenie Player
			if (window._CMLS[nameSpace].player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
				if (window.tgmp && window.TGMP_EVENTS) {
					window.tgmp.addEventListener(window.TGMP_EVENTS.streamplaying, function(e) {
						if (e === true) {
							window._CMLS[nameSpace].start();
							return;
						}
						window._CMLS[nameSpace].stop();
					});
				}
			}

			log('Listeners set, waiting for player event.');
		}
	};

	// Don't initialize if conditions are bad.
	if ( ! window._CMLS[nameSpace].checkCondition()) {
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