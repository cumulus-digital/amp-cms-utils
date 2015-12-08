/**
 * Automatically scroll window past leaderboard on site homepages
 * after X minutes if the leaderboard is at the top of the masthead.
 */
(function($, window, undefined) {

	if ( ! $ || ! $.fn.jquery) {
		throw { message: 'Auto-scroll script called without supplying jQuery.' };
	}

	var scriptName = 'AUTO SCROLL',
		nameSpace = 'cmlsAutoScrollPastLeaderboard',
		version = '0.7',

		settings = {

			// Time before scrolling, in minutes
			timeout: 0.15,

			// Leaderboard selector
			leaderboardSelector: '.wrapper-header div[id^="div-gpt-ad"]:first',

			// Leaderboard height
			leaderboardHeight: 90

		};

	// Only define once.
	if (window._CMLS[nameSpace] || window.DO_NOT_AUTO_SCROLL) {
		return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	window._CMLS[nameSpace] = {
		scrolled: false,
		disabled: false,
		timer: null,
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
				log('Leaderboard was not cached.');
				return false;
			}
			var adOffset = this.cache.leaderboard.offset();
			if (this.playerOnTop()) {
				return adOffset.top < 150;
			}
			return adOffset.top < 50;
		},

		/**
		 * Return true/false if player is at the top of the window
		 * @return {Boolean}
		 */
		playerOnTop: function playerOnTop() {
			var player = window._CMLS.whichPlayer();
			if (player.position === window._CMLS.const.PLAYER_POSITION_TOP) {
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
				var adOffset = this.cache.leaderboard.offset(),
					newPos = adOffset.top + settings.leaderboardHeight;
				if (adOffset > settings.leaderboardHeight + 20) {
					log('Ad offset is greater than leaderboard height settings, assuming returned ad is incorrect.');
					return settings.leaderboardHeight + 10;
				}
				if (this.playerOnTop()) {
					newPos = adOffset.top - this.cache.player.height() + settings.leaderboardHeight;
					log('Player is on top, scrollTo position is ' + newPos, adOffset.top, this.cache.player.height(), this.cache.leaderboard.height());
					return newPos;
				}
				log('Player is on bottom, scrollTo position is ' + newPos, adOffset.top, this.cache.leaderboard.height());
				return newPos;
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
			if (this.disabled || window.DO_NOT_AUTO_SCROLL) {
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
		 * Perform a last-minute conditions check and scroll the page.
		 * @return {void}
		 */
		scrollPage: function scrollPage() {
			var that = this;

			log('Pre-animation conditions check.');
			var conditions = this.conditionsGood();
			if (conditions !== true) {
				log('Conditions check failed.', conditions);
				this.stopTimer();
			}

			log('Conditions are good to scroll.');
			$('html,body').animate(
				{ scrollTop: that.generateScrollToPosition() },
				{
					queue: nameSpace,
					duration: 550
				}
			).dequeue(nameSpace);
		},

		/**
		 * Initializes scroll delay.
		 * @return {void}
		 */
		initTimer: function initTimer() {
			log('Initializing scroll timer.');
			var that = this;

			var conditions = that.conditionsGood();
			if (conditions !== true) {
				log('Conditions check after leaderboard render found bad conditions.', conditions);
				that.stopTimer();
				return;
			}

			$('html,body')
				.clearQueue(nameSpace)
				.stop(nameSpace, true);
			clearTimeout(this.timer);
			this.timer = null;

			this.timer = setTimeout(function() {
				that.scrollPage();
			}, settings.timeout * 60000);
		},

		/**
		 * Halts any current scroll animation and clears the queue.
		 * @return {void}
		 */
		stopTimer: function stopTimer() {
			log('Stopping timer, clearing animation queue.', this.timer);
			$('html,body')
				.clearQueue(nameSpace)
				.stop(nameSpace, true);
			clearTimeout(this.timer);
			this.timer = null;
		},

		resetTimer: function resetTimer() {
			log('Resetting scroll timer.');
			this.initTimer();
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
					that.stopTimer();
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
							that.stopTimer();
						} else {
							that.resetTimer();
						}

						window.googletag.pubads().removeEventListener('slotRenderEnded', cmlsAutoScrollPastLeaderboardRenderListener);
					}
				});
			});

			// If document is already loaded, start queue
			if (window.document.readyState === 'complete') {
				this.initTimer();
				return;
			}

			this.cache.window.on('load', function() {
				that.initTimer();
			});
		}
	};

	$(function() {
		window._CMLS[nameSpace].init();
	});

}(jQuery, window));