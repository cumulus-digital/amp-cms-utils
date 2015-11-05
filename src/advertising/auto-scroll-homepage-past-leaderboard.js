/**
 * Automatically scroll past the leaderboard on site homepages
 */

(function($, window, undefined) {

	if (! $ || ! $.fn.jquery) {
		throw { message: 'Auto-scroll script called without jQuery.' };
	}

	var nameSpace = 'cmlsAutoScrollPastLeaderboard',
		version = '0.5',

		// Minutes before automatically scrolling
		timeout = 0.15;

	// Only define once
	window._CMLS = window._CMLS || {};
	if (window._CMLS[nameSpace]) {
		return;
	}

	window._CMLS[nameSpace] = window._CMLS[nameSpace] || {};
	window._CMLS[nameSpace].scrolled = false;
	window._CMLS[nameSpace].disabled = window._CMLS[nameSpace].disabled || false;

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			var ts = (new Date());
			ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
			console.log('%c[AUTO SCROLL ' + version + ']', 'background: #759bbe; color: #FFF', ts, [].slice.call(arguments));
		}
	}

	// If using TuneGenie's player, don't operate on the top window
	if (window.tgmp && window === window.top) {
		log('Called in top window while using TuneGenie player, exiting.');
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

	var cache = {},
		PLAYER_POSITION_TOP = 1,
		PLAYER_POSITION_BOTTOM = 2;

	function isHomepage() {
		return window.location.pathname === '/' && /[\?&]?p=/i.test(window.location.search) === false;
	}

	/**
	 * Determine if site has leaderboard on top of the masthead
	 * @return {Boolean}
	 */
	function hasLeaderboardOnTop() {
		if ( ! cache.leaderboard || ! cache.playerbar) {
			return false;
		}
		var adOffset = cache.leaderboard.offset();
		if (playerBarPosition() === PLAYER_POSITION_TOP) {
			return adOffset.top < 100;
		}
		return adOffset.top < 30;
	}

	/**
	 * Determine the player position with support for TuneGenie and Triton players
	 * @return {String} 'top' or 'bottom'
	 */
	function playerBarPosition() {
		if (
			cache.playerbar.length &&
			cache.playerbar.attr('id') &&
			cache.playerbar.attr('id').toLowerCase() === 'tgmp_frame' &&
			window.tgmp &&
			window.tgmp.options &&
			window.tgmp.options.position
		) {
			if (window.tgmp.options.position.toLowerCase() === 'bottom') {
				return PLAYER_POSITION_BOTTOM;
			}
		}
		return PLAYER_POSITION_TOP;
	}

	/**
	 * Determine the bottom of the leaderboard, accounting for its offset and the
	 * player's height vs scrollTop
	 * @return {Number} Bottom offset of the leaderboard
	 */
	function generateNewPos() {
		if (cache.leaderboard) {
			if (playerBarPosition() === PLAYER_POSITION_TOP) {
				return cache.leaderboard.offset().top - cache.playerbar.height() + cache.leaderboard.height();
			}
			return cache.leaderboard.offset().top + cache.leaderboard.height();
		}
		return 0;
	}

	/**
	 * Determine if current scroll position is past the bottom of the leaderboard
	 * @return {Boolean} [description]
	 */
	function hasScrolledPastLeaderboard() {
		if (window._CMLS[nameSpace].scrolled === true) {
			return true;
		}
		if ($(window).scrollTop() >= generateNewPos()) {
			return true;
		}
		return false;
	}

	/**
	 * Regenerate node caches
	 * @return {undefined}
	 */
	window._CMLS[nameSpace].regenerateCache = function() {
		cache.leaderboard = $('.wrapper-header div[id*="div-gpt-ad"]:first');
		cache.playerbar = $('.tdpw:first,#tgmp_frame:first');
	};

	/**
	 * Determine if conditions favor activating the library.
	 * Checks if user is on the homepage, if the leaderboard is on top,
	 * and if they have already scrolled
	 * @return {String|Boolean} Returns true if conditions are good, error string otherwise.
	 */
	function areConditionsGood() {
		if ( ! isHomepage()) {
			return 'Not on homepage.';
		}

		window._CMLS[nameSpace].regenerateCache();
		if ( ! hasLeaderboardOnTop()) {
			return 'Leaderboard is not on top.';
		}

		window._CMLS[nameSpace].scrolled = hasScrolledPastLeaderboard();
		if (window._CMLS[nameSpace].scrolled) {
			return 'Already scrolled passed leaderboard.';
		}

		if (window._CMLS[nameSpace].disabled) {
			return 'Auto-scroll disabled for this site.';
		}

		return true;
	}

	function initAnimation() {
		$('html,body')
			.delay(timeout * 60000, nameSpace)
			.queue(nameSpace, function() {
				var conditions = areConditionsGood();
				if ( ! conditions) {
					log(conditions);
					stopAnimation();
					return false;
				}
				log('Scrolling homepage past leaderboard.');
			})
			.animate(
				{ scrollTop: generateNewPos() },
				{
					queue: nameSpace,
					duration: 550
				}
			)
			.dequeue(nameSpace);
	}

	function stopAnimation() {
		$('html,body')
			.clearQueue(nameSpace)
			.stop(nameSpace, true, false);
	}

	function resetAnimation() {
		stopAnimation();
		initAnimation();
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
				initAnimation();
			});
		}
	};

	$(function() {
		window._CMLS[nameSpace].init();
		$(window).on('scroll.' + nameSpace, throttle(function() {
			if (hasScrolledPastLeaderboard()) {
				window._CMLS[nameSpace].scrolled = true;
				$(window).off('.' + nameSpace);
			}
		}, 500));

		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push(function() {
			window.googletag.pubads().addEventListener('slotRenderEnded', function(e) {
				if (
					! e.isEmpty && 
					e.slot.getTargeting('pos').indexOf('top') > -1
				) {
					log('Caught googletag render event.');

					var conditions = areConditionsGood();

					if (conditions !== true) {
						log('Googletag check found bad conditions.', conditions);
						stopAnimation();
						return;
					}

					resetAnimation();
				}
			});
		});
	});

}(jQuery, window.self));