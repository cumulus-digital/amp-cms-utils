/**
 * Automatically scroll past the leaderboard on site homepages
 */
(function($, window, undefined) {

	var nameSpace = 'cmlsAutoScrollPastLeaderboard',
		version = '0.3';

		// Minutes before automatically scrolling
		timeout = 0.05; // 3 seconds

	var scrolled = false;

	// Only define once
	window._CMLS = window._CMLS || {};
	if (window._CMLS[nameSpace]) {
		return;
	}

	window._CMLS[nameSpace] = window._CMLS[nameSpace] || {};

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			var ts = (new Date());
			ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
			console.log('%c[AUTO SCROLL ' + version + ']', 'background: #759bbe; color: #FFF', ts, [].slice.call(arguments));
		}
	}

	function throttle(fn, threshhold, scope) {
		threshhold = threshhold || (threshhold = 250);
		var last,
			deferTimer;
		return function () {
			var context = scope || this;
			var now = +(new Date()),
				args = arguments;
			if (last && now < last + threshhold) {
				// hold on to it
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	}

	var cache = {};

	function isHomepage() {
		return window.location.pathname == '/' && window.location.search.indexOf('?p=') != 0;
	}

	function hasLeaderboardOnTop() {
		var offset = cache.leaderboard.offset();
		return cache.tdpw.length && offset.top < 100;
	}

	function generateNewPos() {
		return cache.leaderboard.offset().top - cache.tdpw.height() + cache.leaderboard.height();
	}

	function hasScrolledPastLeaderboard() {
		if ($(window).scrollTop() >= generateNewPos()) {
			return true;
		}
		return false;
	}

	function scrollPage() {
		var conditions = areConditionsGood();

		if (conditions !== true) {
			log('Scrolling check found bad conditions.', conditions);
			return;
		}
		log('Scrolling homepage past leaderboard.');
		$('html,body').animate({
			scrollTop: generateNewPos()
		}, 600);
		scrolled = true;
	}

	window._CMLS[nameSpace].regenerateCache = function() {
		cache.leaderboard = $('.wrapper-header div[id*="div-gpt-ad"]:first');
		cache.tdpw = $('.tdpw:first');
	};

	function setTimer() {
		log('Setting timer.');
		window._CMLS[nameSpace].timer = setTimeout(
			scrollPage,
			timeout * 60000
		);
	}

	function areConditionsGood() {
		if ( ! isHomepage()) {
			return 'Not on homepage.';
		}

		window._CMLS[nameSpace].regenerateCache();
		if ( ! hasLeaderboardOnTop()) {
			return 'Leaderboard is not on top.';
		}

		scrolled = hasScrolledPastLeaderboard();
		if (scrolled) {
			return 'Already scrolled passed leaderboard.';
		}

		return true;
	}

	window._CMLS[nameSpace].init = function() {
		window._CMLS = window._CMLS || {};
		if (window._CMLS[nameSpace]) {
			log('Initializing auto-scroll.');

			var conditions = areConditionsGood();

			if (conditions !== true) {
				log('Init check found bad conditions.', conditions);
				return;
			}

			$(window).on('load', function() {
				setTimer();
			});
		}
	};

	$(function() {
		window._CMLS[nameSpace].init();
		$(window).on('scroll.' + nameSpace, throttle(function() {
			if (hasScrolledPastLeaderboard()) scrolled = true;
		}, 240));

		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		googletag.cmd.push(function() {
			googletag.pubads().addEventListener('slotRenderEnded', function(e) {
				if (
					! e.isEmpty && 
					e.slot.getTargeting('pos').indexOf('top') > -1
				) {
					log('Caught googletag render event.');

					var conditions = areConditionsGood();

					if (conditions !== true) {
						log('Googletag check found bad conditions.', conditions);
						return;
					}

					$('#'+e.slot.getSlotElementId() + ' iframe[id*="google_ads"]').load(function() {
						setTimer();
					});
				}
			});
		});
	});

}(jQuery, window));