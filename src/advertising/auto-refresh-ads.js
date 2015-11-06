/**
 * Auto-refreshes ads every x minutes while stream is playing.
 */
(function(window, undefined) {
	var scriptName = 'AUTO REFRESH ADS',
		nameSpace = 'autoRefreshAds',
		version = '0.3',

		// Time before refreshing ads, in minutes
		timeout = 8;

	// Only run once.
	if (window._CMLS[nameSpace]) {
		return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	window._CMLS[nameSpace] = {
		player: window._CMLS.whichPlayer(),
		timer: null,
		boundToRenderEvent: false,

		checkConditions: function checkConditions() {
			if (
				window._CMLS.isHomepage() &&
				window._CMLS.autoReloader &&
				window._CMLS.autoReloader.active
			) {
				log('Autoreloader is active, conditions fail.');
				return false;
			}

			return true;
		},

		stop: function stop() {
			log('Stopping timer.');
			clearTimeout(this.timer);
			this.timer = null;
			return this;
		},

		start: function start() {
			this.stop();

			if ( ! this.checkConditions()) {
				return;
			}

			log('Starting timer.');
			var that = this;
			this.timer = setTimeout(function() {
				that.fire();
			}, timeout * 60000);

			return this;
		},

		fire: function fire() {
			if ( ! this.checkConditions()) {
				return;
			}

			var that = this;
			window.googletag.cmd.push(function() {
				log('Refreshing ads.');
				window.googletag.pubads().refresh();
				that.start();
			});
		},

		init: function init() {
			log('Initializing.');

			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];

			// Initialize listeners for Triton Player
			if (this.player.type === window._CMLS.const.PLAYER_TRITON) {

				window.addEventListener(
					'td-player.stopped',
					function() {
						window._CMLS[nameSpace].stop();
					},
					false
				);
				window.addEventListener(
					'td-player.playing',
					function() {
						window._CMLS[nameSpace].start();
					},
					false
				);

				// Restart timer if history changes
				if (window.History && window.History.Adapter) {
					window.History.Adapter.bind(
						window,
						'pageChange',
						function() {
							window._CMLS[nameSpace].start();
						}
					);
				}

			}

			// Initialize listeners for TuneGenie Player
			if (this.player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
				if (window.tgmp && window.TGMP_EVENTS) {
					window.tgmp.addEventListener(
						window.TGMP_EVENTS.streamplaying,
						function(e) {
							if (e === true) {
								window._CMLS[nameSpace].start();
								return;
							}
							window._CMLS[nameSpace].stop();
						}
					);
				}
			}

			log('Listeners set, waiting for player event.');
		}
	};

	var initialized = false;
	function initTest() {
		if ( ! window._CMLS.cGroups) {
			log('Init test called without cGroups available, exiting.');
			return;
		}
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