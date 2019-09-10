/**
 * Automatically refresh ads on the page while playing stream
 * for Talk and Sports format stations.
 */
;(function(window, undefined) {
	
	var scriptName = "AUTO REFRESH ADS",
		nameSpace = "autoRefreshAds",
		version = "0.5.2";

	function log() {
		if(window.top._CMLS && window.top._CMLS.hasOwnProperty('logger')) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	if (window.DISABLE_AUTO_REFRESH_ADS) {
		log('Auto Refresh Ads is disabled');
		return false;
	}

	// Time before refreshing ads
	window._CMLS.autoRefreshAdsTimer = window._CMLS.autoRefreshAdsTimer || 4;

	var AutoRefresher = function(instFireTime) {
		var me = this,

			// Determine which player we're using
			player = window._CMLS.whichPlayer(),

			// Contains the current timer
			timer = null,

			// When the next firing event should occur
			fireTime = instFireTime || null,

			// Current state
			on = false;

		// Retrieves the window to refresh
		function getWindow() {
			if (player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
				var iframe = window.top.document.querySelector('iframe#page_frame');
				if (iframe && iframe.contentWindow) {
					log('Window context is page_frame');
					return iframe.contentWindow;
				}
			}
			log('Window context is window');
			return window;
		}

		// Checks that autorefresh should happen
		function checkConditions() {
			// if autoReload is active, don't refresh ads
			if (
				window.top._CMLS.autoReload &&
				window.top._CMLS.autoReload.active
			) {
				log('AutoReloadPage is active, autoRefreshAds will be disabled.');
				return false;
			}
			return true;
		}

		// Check if we should fire now
		function checkTimer() {
			if ( ! checkConditions()) {
				log('Conditions have gone bad, killing timer.');
				me.stop();
				return;
			}

			var now = new Date();
			log('Checking timer', [now.toLocaleString(), fireTime.toLocaleString()]);
			if (now.getTime() >= fireTime.getTime()) {
				// It's time to fire a refresh!
				fire();
				return;
			}

			// Not ready yet, start a new cycle
			timer = setTimeout(checkTimer, 10000);
		}

		// Expose a way to check the current timer state
		this.checkState = function() {
			return on;
		};

		// Expose a way to stop the timer
		this.stop = function() {
			log('Stopping timer.');
			clearTimeout(timer);
			timer = null;
			fireTime = null;
			on = false;
		};

		/**
		 * Exposed method to start the timer
		 * @param  {boolean} initFireTime (optional) Specify an initial start time
		 * @return {AutoRefresher}
		 */
		this.start = function(initFireTime) {
			me.stop();

			if ( ! checkConditions()) {
				log('Conditions are bad, timer will not start.');
				return me;
			}

			// Set the fire time
			if (initFireTime && initFireTime instanceof Date) {
				log('Start called with a fire time.', initFireTime);
				fireTime = initFireTime;
			} else {
				me.resetFireTime();
			}

			log('Starting timer, will fire at ' + fireTime.toLocaleString());
			checkTimer();
			on = true;
		};

		// Expose method to tear down timer and end listeners
		this.destroy = function() {
			me.stop();
			// Do we need to remove events??
		};

		// Expose method to retrieve fire time
		this.getFireTime = function() {
			return fireTime;
		};

		// Expose method to reset fire time
		this.resetFireTime = function() {
			fireTime = new Date(
				(new Date()).getTime() + (window._CMLS.autoRefreshAdsTimer * 60000)
			);
		};

		// Check current state of TuneGenie player
		function checkTuneGeniePlayerState(e) {
			if (e === true) {
				log('TuneGenie Player is streaming.');
				me.start();
				return true;
			}
			log('TuneGenie Player has stopped.');
			me.stop();
			return false;
		}

		// Initialize TG player events
		if (player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
			if (window.top.tgmp && window.top.TGMP_EVENTS) {
				window.top.tgmp.addEventListener(
					window.top.TGMP_EVENTS.streamplaying,
					checkTuneGeniePlayerState
				);
				log('Now listening for TuneGenie Player events.');
			} else {
				log('TuneGenie player not available!');
			}
		}

		function fire() {
			if ( ! checkConditions()) {
				log('Conditions have gone bad before firing, killing timer.');
				me.stop();
				return false;
			}

			var windowContext = getWindow();

			log('Firing!', windowContext._CMLS.adTag);

			windowContext._CMLS.adTag.queue(function() {
				log('Refreshing page ads.');
				windowContext._CMLS.adTag.refresh();
				me.start();
			});
		}

		// If we've been instantiated with an initial fire time, use it
		if (fireTime && fireTime instanceof Date) {
			log('Instantiated with a time to fire, using it!');
			me.start(fireTime);
		}
	};

	var initialized = false;
	function initTest() {
		if (initialized) {
			return;
		}
		log('Testing initial state.');

		function testEventListener(e) {
			if (initialized) {
				window.removeEventListener(
					'cms-sgroup',
					testEventListener
				);
			}
			if (e.detail.indexOf('Format') > -1) {
				log('cms-sgroup "Format" event fired!');
				initTest();
			}
		}

		if ( ! window._CMLS.cGroups) {
			log('cGroups not available, will wait for cms-sgroup event.');
			window.addEventListener(
				'cms-sgroup',
				testEventListener,
				false
			);
			return;
		}

		window._CMLS.cGroups.forEach(function(cGroup) {
			if (initialized) { return; }
			if (/Format\s+.*(Talk|Sports)/i.test(cGroup)) {
				log('Station is Talk or Sports format, initializing timer.');
				window._CMLS[nameSpace] = new AutoRefresher();
				initialized = true;
				return;
			}
		});

		if ( ! initialized) {
			log('Station is not Talk or Sports, no timer set.');
			return false;
		}
	}

	log('Initializing.');
	initTest();

}(window.self));