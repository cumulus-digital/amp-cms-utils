/**
 * Auto-refreshes ads every x minutes while stream is playing.
 */
;(function(window,undefined){

	var scriptName = 'AUTO REFRESH ADS',
		nameSpace = 'autoRefreshAds',
		version = '0.4',

		/**
		 * Default timeout for timer, specified in minutes.
		 * @type {Number}
		 */
		defaultTimeout = 4;

	var _CMLS = window._CMLS;

	// Only run once
	if (_CMLS[nameSpace]) {
		return;
	}

	function log() {
		window._CMLS.log(scriptName + ' v' + version, arguments);
	}

	// Initialize googletag variables
	window.googletag = window.googletag || {};
	window.googletag.cmd = window.googletag.cmd || [];

	// Instantiate ourselves
	function AutoRefreshAds() {
		var player = _CMLS.whichPlayer(),
			timer = null,
			that = this;

		this.timeout = _CMLS.autoRefreshAdsTimer || defaultTimeout;

		/**
		 * Checks if conditions favor auto-refreshing ads.
		 * @return {boolean} Returns true if we're clear to refresh, false otherwise.
		 */
		this.checkConditions = function(){
			if (
				_CMLS.autoReloader &&
				_CMLS.autoReloader.active
			) {
				log('Autoreloader is active, conditions fail.');
				return false;
			}
			return true;
		};

		/**
		 * Stops the timer
		 * @return {autoRefreshAds}
		 */
		this.stop = function(){
			log('Stopping timer.');
			clearTimeout(timer);
			timer = null;
			return that;
		};

		/**
		 * Starts the timer
		 * @return {boolean}
		 */
		this.start = function(){
			that.stop();

			if ( ! that.checkConditions()) {
				return false;
			}

			log('Starting timer for ' + that.timeout + ' minute countdown.');
			that.timer = setTimeout(function(){
				that.fire();
			}, that.timeout * 60000);

			return true;
		};

		this.fire = function(){
			if ( ! that.checkConditions()) {
				return false;
			}

			window.googletag.cmd.push(function(){
				log('Refreshing ads.');
				window.googletag.pubads().refresh();
				that.start();
			});
		};

		log('Initializing.');

		// Initialize listeners for players
		window.addEventListener(
			'cmls-player.stopped',
			function(){
				that.stop();
			},
			false
		);
		window.addEventListener(
			'cmls-player.playing',
			function(){
				that.start();
			},
			false		);

		// Restart the timer if history changes
		// Restart the timer if history changes
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

	
	/**
	 * We only initialize on certain formats, and we can't know when we're going
	 * to get that information from the site groups, so we have to check once
	 * explicitly, then bind an event to the sgroup initializer.
	 */
	var initialized = false;
	function initTest() {
		if ( ! _CMLS.sGroups) {
			log('Init test called without sgroups available.');
			return;
		}
		for (var i in _CMLS.sGroups) {
			if (/Format\s+(.*Talk.*|Sports)/.test(_CMLS.sGroups[i])) {
				log('Format is good.');
				_CMLS[nameSpace] = new AutoRefreshAds();
				initialized = true;
			}
		}
	}
	initTest();
	window.addEventListener('cms-sgroup', function(){
		if ( ! initialized) {
			initTest();
		}
	}, false);

}(window));