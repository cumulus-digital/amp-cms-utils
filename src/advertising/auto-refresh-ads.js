/**
 * Reload ads every 6 minutes
 */
/* globals googletag */
(function(window, undefined) {
	var nameSpace = 'AutoRefreshAds',
		version = '0.1',

		// Time before refreshing ads in minutes
		timeout = 6;


	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			var ts = (new Date());
			ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
			console.log('%c[AUTO REFRESH ADS ' + version + ']', 'background: #557b9e; color: #FFF', ts, [].slice.call(arguments));
		}
	}

	// Don't run in the topmost window if we're using TuneGenie's player
	if (window.tgmp && window === window.top) {
		log('Using TuneGenie player and injected in top window, ejecting.');
		return;
	}

	// Only inject once
	window._CMLS = window._CMLS || {};
	if (window._CMLS[nameSpace]) {
		return;
	}

	window._CMLS[nameSpace] = {
		timer: null
	};

	function clearTimer() {
		if (window._CMLS && window._CMLS[nameSpace] && window._CMLS[nameSpace].timer) {
			clearTimeout(window._CMLS[nameSpace].timer);
			window._CMLS[nameSpace].timer = null;
		}
	}

	// Restart timer when ads refresh
	window.addEventListener('td-player.playing', function() {
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push(function() {
			googletag.pubads().addEventListener('slotRenderEnded', function() {
				if (window._CMLS[nameSpace] && window._CMLS[nameSpace].timer) {
					return;
				}
				log('Starting timer.');
				window._CMLS[nameSpace].timer = setTimeout(function() {
					if (googletag && googletag.pubads) {
						log('Firing refresh.');
						googletag.pubads().refresh();
						window._CMLS[nameSpace].timer = null;
					}
				}, timeout * 60000);
			});
			googletag.pubads().refresh();
		});
	}, false);

	window.addEventListener('td-player.stopped', function() {
		clearTimer();
	}, false);

	// Clear timer when history changes
	window.addEventListener('statechange', function() {
		clearTimer();
	}, false);

}(window.self));