/**
 * Scroll past the leaderboard on the homepage after x minutes
 */
(function($, window, undefined) {

	var nameSpace = 'cmlsAutoScrollPastLeaderboard',
		version = '0.1',

		// minutes before automatically scrolling
		timeout = 3;

	var scrolled = false;

	window._CMLS = window._CMLS || {};

	// Only define once.
	if (window._CMLS[nameSpace]) return;

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

	var timer,
		tdpw,
		leaderboard;

	function isHomepage() {
		return window.location.pathname == '/';
	}

	function generateNewPos() {
		return leaderboard.offset().top - tdpw.height() + leaderboard.height();
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
		leaderboard = $('.wrapper-header div[id*="div-gpt-ad"]:first');
		tdpw = $('.tdpw:first');
		$(window).on('scroll.' + nameSpace, throttle(function() {
			if (scrolledPastLeaderboard()) scrolled = true;
		}, 240));
		window._CMLS[nameSpace] = setInterval(scrollPage, timeout * 60000);
	});

}(jQuery, window));