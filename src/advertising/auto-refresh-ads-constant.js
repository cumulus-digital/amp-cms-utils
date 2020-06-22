/**
 * Automatically refresh VIEWABLE page ads
 */
;(function(window, undefined) {
	
	var scriptName = "AUTO REFRESH ADS",
		nameSpace = "autoRefreshAds",
		version = "0.6.1";

	function log() {
		if(window.top._CMLS && window.top._CMLS.hasOwnProperty('logger')) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	if (window.DISABLE_AUTO_REFRESH_ADS) {
		log('Auto Refresh Ads is disabled');
		return false;
	}

	// Time before refreshing ads, in minutes.
	window._CMLS.autoRefreshAdsTimer = window._CMLS.autoRefreshAdsTimer || 4;

	var AutoRefresher = function(instFireTime) {
		var me = this,

			// Tab visibility
			tabVisibility = 'visible',
			hidden, visibilityChange,

			// Determine which player we're using
			player = window._CMLS.whichPlayer(),

			// Current timer holder
			timer = null,

			// When the next firing should occur
			fireTime = instFireTime || null,

			// Current state
			on = false;

		if (typeof window.document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
			hidden = "hidden";
			visibilityChange = "visibilitychange";
		} else if (typeof window.document.mozHidden !== "undefined") {
			hidden = "mozHidden";
			visibilityChange = "mozvisibilitychange";
		} else if (typeof window.document.msHidden !== "undefined") {
			hidden = "msHidden";
			visibilityChange = "msvisibilitychange";
		} else if (typeof window.document.webkitHidden !== "undefined") {
			hidden = "webkitHidden";
			visibilityChange = "webkitvisibilitychange";
		} else if (typeof window.document.oHidden !== "undefined") {
			hidden = "oHidden";
			visibilityChange = "ovisibilitychange";
		}

		// Retrieves the window to refresh
		function getWindow() {
			if (player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
				var iframe = window.top.document.querySelector('iframe#page_frame,iframe[name="pwm_pageFrame"]');
				if (iframe && iframe.contentWindow) {
					log('Window context is TuneGenie frame');
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
				return -1;
			}
			// If window is currently hidden, don't refresh ads
			if (tabVisibility !== 'visible') {
				log('Tab is hidden, autoRefreshAds will skip this cycle.');
				return 0;
			}
			return 1;
		}

		function checkTimer() {
			var condition = checkConditions();
			if (condition === 1) {
				var now = new Date();
				log('Checking timer', [now.toLocaleString(), fireTime.toLocaleString()]);
				if (now.getTime() >= fireTime.getTime()) {
					fire();
					return;
				}
			}
			if (condition === -1) {
				me.stop();
				return;
			}

			timer = setTimeout(function(){
				checkTimer();
			}, 10000);
		}

		// Determine if given element is at least half within viewport
		function isElVisible(el) {
			if ( ! el) {
				return false;
			}

			// If element is currently hidden, quickly make it visible
			// so we can get a reading on it
			var isHidden = false;
			if (el.style && el.style.display && el.style.display === 'none') {
				el.setAttribute('style', 'display: block; width: 1px; height: 1px;');
			}
			
			var rect = el.getBoundingClientRect();

			rect.width = (rect.right - rect.left);
			rect.height = (rect.bottom - rect.top);

			if (rect.width === 0 || rect.height === 0) {
				return false;
			}

			if (isHidden) {
				el.setAttribute('style', 'display: none');
			}

			var check = {
				top: rect.top + (rect.height/2),
				right: rect.right - (rect.width/2),
				bottom: rect.bottom - (rect.height/2),
				left: rect.left + (rect.width/2)
			};

			return (
				check.bottom >= 0 &&
				check.right >= 0 &&
				check.top <= (window.innerHeight || document.documentElement.clientHeight) &&
				check.left <= (window.innerWidth || document.documentElement.clientWidth)
			);
		}

		function recordTabVisibility(state) {
			if ( ! state) {
				state = window.document[hidden] ? 'hidden' : 'visible';
			}
			tabVisibility = state;
		}
		window.document.addEventListener(visibilityChange, function() {
			recordTabVisibility();
		}, false);

		// Fire ad refresh on visible units
		function fire() {

			if (checkConditions() === 1) {
				var windowContext = getWindow();
				log('Firing!', windowContext._CMLS.adTag);
				windowContext._CMLS.adTag.queue(function() {
					log('Refreshing viewable page ads.');
					me.resetFireTime();

					try {
						var ads = windowContext._CMLS.adTag.pubads().getSlots(),
							visibleSlots = [];
						ads.forEach(function(ad) {
							var el = windowContext.document.getElementById(ad.getSlotElementId());
							if (el && isElVisible(el)) {
								visibleSlots.push(ad);
							}
						});
						log('Viewable ads:', visibleSlots);
						windowContext._CMLS.adTag.refresh(visibleSlots);
					} catch(e) {
						log('Failed to refresh ads!', e);
					}

					me.start();
				});
				return;
			}

			log('Conditions were not met before firing, skipping this cycle.');
			me.start();

		}

		this.checkState = function() {
			return on;
		};

		this.stop = function() {
			log('Stopping timer.');
			clearTimeout(timer);
			timer = null;
			fireTime = null;
			on = false;
		};

		this.start = function(initFireTime) {
			me.stop();

			if (checkConditions() === 1) {

				if (initFireTime && initFireTime instanceof Date) {
					log('Start called with an init fire time.', initFireTime);
					fireTime = initFireTime;
				} else {
					me.resetFireTime();
				}

				log('Starting timer, will fire at ' + fireTime.toLocaleString());
				checkTimer();
				on = true;

			}

			return me;
		};

		this.destroy = function() {
			me.stop();
		};

		this.getFireTime = function() {
			return fireTime;
		};

		this.resetFireTime = function() {
			fireTime = new Date(
				(new Date()).getTime() + (window._CMLS.autoRefreshAdsTimer * 60000)
			);
		};

		if (fireTime && fireTime instanceof Date) {
			log('Instantiated with a time to fire, using it!');
			me.start(fireTime);
		}

	};

	try {
		window.parent._CMLS[nameSpace].destroy();
	} catch(e) {}
	try {
		window._CMLS[nameSpace].destroy();
	} catch(e) {}

	window._CMLS[nameSpace] = new AutoRefresher();
	window._CMLS[nameSpace].start();

}(window.self));