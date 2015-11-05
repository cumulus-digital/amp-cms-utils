/**
 * Automatically scroll window past leaderboard on site homepages
 * after X minutes if the leaderboard is at the top of the masthead.
 */
(function($, window, undefined) {

	if ( ! $ || ! $.fn.jquery) {
		throw { message: 'Auto-scroll script called without supplying jQuery.' };
	}

	var nameSpace = 'cmlsAutoScrollPastLeaderboard',
		version = '0.7',

		settings = {

			// Time before scrolling, in minutes
			timeout: 0.15,

			// Leaderboard selector
			leaderboardSelector: '.wrapper-header div[id^="div-gpt-ad"]:first'

		};

	// Only define once.
	if (window._CMLS[nameSpace]) {
		return;
	}

	function log() {
		var message = [].concat(nameSpace + ' v' + version, '(' + log.caller.name + ')', [].slice.call(arguments));
		window._CMLS.logger(message);
	}

	window._CMLS[nameSpace] = {
		scrolled: false,
		disabled: false,
		cache: {},

		/**
		 * Regenerate node caches
		 * @return {void}
		 */
		regenerateCache: function regenerateCache() {
			this.cache.leaderboard = $(settings.leaderboardSelector);
			this.cache.player = $('#tgmp_frame:first,.tdpw:first');
			this.cache.window = $(window);
		},

		/**
		 * Determines if site has a leaderboard ad at the top of its masthead
		 * @return {Boolean}
		 */
		leaderboardOnTop: function leaderboardOnTop() {
			if ( ! this.cache.leaderboard) {
				return false;
			}
			var adOffset = this.cache.leaderboard.offset();
			if (this.playerOnTop()) {
				return adOffset.top < 100;
			}
			return adOffset.top < 50;
		},

		/**
		 * Return true/false if player is at the top of the window
		 * @return {Boolean}
		 */
		playerOnTop: function playerOnTop() {
			var player = window._CMLS.whichPlayer();
			if (player.position === window._CMLS.const.PLAYER_POSTITION_TOP) {
				return true;
			}
			return false;
		},

		/**
		 * Generate the position we should scroll to by calculating the bottom
		 * of the leaderboard, accounting for a top player's height.
		 * @return {Number} Bottom offset of the leaderboard ad.
		 */
		generateScrollToPosition: function generateScrollToPosition() {
			if (this.cache.leaderboard) {
				var adOffset = this.cache.leaderboard.offset();
				if (this.playerOnTop()) {
					return adOffset.top - this.cache.player.height() + this.cache.leaderboard.height();
				}
				return adOffset.top + this.cache.leaderboard.height();
			}
			return 0;
		},

		/**
		 * Determine if the current scroll position is beyond the bottom of
		 * the leaderboard ad.
		 * @return {Boolean}
		 */
		hasScrolledPastLeaderboard: function hasScrolledPastLeaderboard() {
			if (this.scrolled === true) {
				return true;
			}
			if (this.cache.window.scrollTop() >= this.generateScrollToPosition()) {
				this.scrolled = true;
				return true;
			}
			return false;
		},

		/**
		 * Determine if conditions are good for scrolling the page.
		 * @return {String|Boolean} True if conditions are good, error string otherwise.
		 */
		conditionsGood: function conditionsGood() {
			if (this.disabled) {
				return 'Auto-scroll is disabled for this site.';
			}

			if ( ! window._CMLS.isHomepage()) {
				return 'Not on homepage.';
			}

			if ( ! this.leaderboardOnTop()) {
				return 'Leaderboard is not on top.';
			}

			if (this.hasScrolledPastLeaderboard()) {
				return 'Already scrolled passed leaderboard.';
			}

			return true;
		},

		/**
		 * Initializes animation queue with delay, checks conditions before
		 * and during animation.
		 * @return {void}
		 */
		initAnimation: function initAnimation() {
			log('Initializing animation queue.');
			var that = this;

			var conditions = that.conditionsGood();
			if (conditions !== true) {
				log('Conditions check after leaderboard render found bad conditions.', conditions);
				that.stopAnimation();
				return;
			}

			$('html,body')
				.clearQueue(nameSpace)
				.stop(nameSpace, true)
				.delay(100, nameSpace)
				.dequeue(nameSpace)
				.delay(settings.timeout * 60000, nameSpace)
				.queue(nameSpace, function() {
					log('Pre-animation conditions check.');
					var conditions = that.conditionsGood();
					if (conditions !== true) {
						log(conditions);
						that.stopAnimation();
						return false;
					}
					log('Conditions check passes.');
				})
				.animate(
					{ scrollTop: that.generateScrollToPosition() },
					{
						queue: nameSpace,
						duration: 550,
						step: function() {
							if (that.scrolled === true) {
								log('Interrupting animation.');
								that.stopAnimation();
								return false;
							}
						}
					}
				)
				.dequeue(nameSpace);
		},

		/**
		 * Halts any current scroll animation and clears the queue.
		 * @return {void}
		 */
		stopAnimation: function stopAnimation() {
			log('Stopping animation, clearing queue.');
			$('html,body')
				.clearQueue(nameSpace)
				.stop(nameSpace, true)
				.dequeue(nameSpace);
		},

		resetAnimation: function resetAnimation() {
			log('Resetting animation queue.');
			this.initAnimation();
		},

		init: function init() {
			log('Initializing auto-scroll library.');

			this.regenerateCache();

			var that = this,
				conditions = this.conditionsGood();

			if (conditions !== true) {
				log('Init check found bad conditions.', conditions);
				return;
			}

			// Watch scroll in case we pass leaderboard
			this.cache.window.on('scroll.' + nameSpace, window._CMLS.throttle(function() {
				if (that.hasScrolledPastLeaderboard()) {
					that.scrolled = true;
					that.stopAnimation();
					that.cache.window.off('scroll.' + nameSpace);
				}
			}, 500));

			// Watch for ad refresh in case we load before ad loads
			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];
			window.googletag.cmd.push(function() {
				window.googletag.pubads().addEventListener('slotRenderEnded', function cmlsAutoScrollPastLeaderboardRenderListener(e) {
					if ( ! e.isEmpty && e.slot.getTargeting('pos') === 'top') {
						log('Caught leaderboard render event.');
						
						that.regenerateCache();

						var conditions = that.conditionsGood();
						if (conditions !== true) {
							log('Conditions check after leaderboard render found bad conditions.', conditions);
							that.stopAnimation();
						} else {
							that.resetAnimation();
						}

						window.googletag.pubads().removeEventListener('slotRenderEnded', cmlsAutoScrollPastLeaderboardRenderListener);
					}
				});
			});

			// If document is already loaded, start queue
			if (window.document.readyState === 'complete') {
				this.initAnimation();
				return;
			}

			this.cache.window.on('load', function() {
				that.initAnimation();
			});
		}
	};

	$(function() {
		window._CMLS[nameSpace].init();
	});

}(jQuery, window));