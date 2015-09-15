/**
 * Scroll past the leaderboard on the homepage after x minutes
 */
(function($, window, undefined) {

	var nameSpace = 'cmlsAutoScrollPastLeaderboard',
		version = '0.1',

		// minutes before automatically scrolling
		timeout = 0.05; // 3 seconds

	var scrolled = false;

	window._CMLS = window._CMLS || {};

	// Only define once.
	if (window._CMLS[nameSpace]) {
		window._CMLS[nameSpace].regenerateCache();
		return;
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

	function regenerateCache() {
		cache.leaderboard = $('.wrapper-header div[id*="div-gpt-ad"]:first');
		cache.tdpw = $('.tdpw:first');
	}

	function isHomepage() {
		return window.location.pathname == '/';
	}

	function generateNewPos() {
		return cache.leaderboard.offset().top - cache.tdpw.height() + cache.leaderboard.height();
	}

	function scrolledPastLeaderboard() {
		if ($(window).scrollTop() > generateNewPos()) {
			return true;
		}
		return false;
	}

	function scrollPage() {
		if ( ! isHomepage()) return;
		if (scrolled) return;
		$('html,body').animate({
			scrollTop: generateNewPos()
		}, 1000);
		scrolled = true;
	}

	$(function() {
		regenerateCache();
		$(window).on('scroll.' + nameSpace, throttle(function() {
			if (scrolledPastLeaderboard()) scrolled = true;
		}, 240));
		window._CMLS[nameSpace] = {
			timer: setInterval(scrollPage, timeout * 60000),
			regenerateCache: regenerateCache
		};
	});

}(jQuery, window));