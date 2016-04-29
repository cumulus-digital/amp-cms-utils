/**
 * Auto-refreshes ads every x minutes while stream is playing.
 */
(function(window, undefined) {
	var scriptName = 'AUTO REFRESH ADS',
		nameSpace = 'autoRefreshAds',
		version = '0.4.0';

	// Time before refreshing ads, in minutes
	window._CMLS = window._CMLS || {};
	window._CMLS.autoRefreshAdsTimer = window._CMLS.autoRefreshAdsTimer || 4;

	function log() {
		window.top._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	window._CMLS[nameSpace] = {
		player: window.top._CMLS.whichPlayer(),
		timer: null,
		boundToRenderEvent: false,

		checkConditions: function checkConditions(){
			if (
				window.top._CMLS.isHomepage(window) &&
				window._CMLS.autoReloader &&
				window._CMLS.autoReloader.active
			){
				log('Autoreloader is active but conditions fail.');
				return false;
			}

			return true;
		},

		stop: function stop(){
			log('Stopping timer.');
			clearTimeout(this.timer);
			return this;
		},

		start: function start(){
			this.stop();
			if ( ! this.checkConditions()) {
				return;
			}

			log('Starting timer at ' + window._CMLS.autoRefreshAdsTimer + ' minutes.');
			var that = this;
			this.timer = setTimeout(function() {
				that.fire();
			}, window._CMLS.autoRefreshAdsTimer * 60000);

			return this;
		},

		fire: function fire(){
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

		init: function init(){
			log('Initializing.');

			var that = this;

			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];

			// Initialize listeners for Triton Player
			if (this.player.type === window._CMLS.const.PLAYER_TRITON) {

				window.addEventListener(
					'td-player.stopped',
					function() {
						that.stop();
					},
					false
				);
				window.addEventListener(
					'td-player.playing',
					function() {
						that.start();
					},
					false
				);

				// Restart timer if history changes
				if (window.History && window.History.Adapter) {
					window.History.Adapter.bind(
						window,
						'pageChange',
						function() {
							that.start();
						}
					);
				}

			}

			// Initialize listeners for TuneGenie Player
			if (this.player.type === window.top._CMLS.const.PLAYER_TUNEGENIE) {
				if (window.tgmp && window.TGMP_EVENTS) {
					window.tgmp.addEventListener(
						window.TGMP_EVENTS.streamplaying,
						function(e) {
							if (e === true) {
								that.start();
								return;
							}
							that.stop();
						}
					);
				}
			}

			log('Listeners set, waiting for player event.');
			log('Timer initialized at ' + window._CMLS.autoRefreshAdsTimer + ' minutes.');
		}
	};

	var initialized = false;
	function initTest() {
		if ( ! window.top._CMLS.cGroups) {
			log('Init test called without cGroups available, exiting.');
			return;
		}
		for (var i = 0; i < window.top._CMLS.cGroups.length; i++) {
			if (
				/Format\s+(NewsTalk|Talk|Sports|Christian Talk)/i.test(window.top._CMLS.cGroups[i])
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

}(window.self));