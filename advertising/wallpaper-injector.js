/**
 * Wallpaper injection for AMP CMS
 */
(function($, w, undefined) {
	
	"use strict";

	var injectorNamespace = 'cmlsWallpaperInjector',
		version = '0.10';

	w[injectorNamespace] = w[injectorNamespace] || [];
	var injectorObject = w[injectorNamespace];

	// Settings
	var globalSettings = {

		// Node selector for where to inject background
		nodeSelector: '.wrapper-content',

		// Node selector for where to determine stick position
		stickNodeSelector: '.wrapper-header',

		// Node selector for content area
		contentNodeSelector: '.wrapper-content .grid-container:first',

		// Nodes to hide/show with background
		obstructiveNodeSelector: '.takeover-left,.takeover-right,.skyscraper-left,.skyscraper-right',

		// Padding for scroll position check
		tolerance: 0,

		// Delay between each reading of scroll position
		debounceDelay: 50
	};

	// Initial caches
	var $node = $(globalSettings.nodeSelector),
		$stickNode = $(globalSettings.stickNodeSelector),
		$contentNode = $(globalSettings.contentNodeSelector),
		wd = w.document;
	var cache = {
		w: $(w),
		wd: $(wd),
		node: $node,
		nodeOffset: $node.offset(),
		stickNode: $stickNode,
		contentNode: $contentNode,
		injectedWallpaperStyles: {},
		originalBackgroundStyles: $node.css(['backgroundImage','backgroundColor','backgroundAttachment','backgroundPosition','backgroundRepeat','backgroundSize','cursor']),
		originalContentStyles: $contentNode.css(['boxShadow','cursor'])
	};

	// If library is already defined, bounce.
	if (
		injectorObject &&
		injectorObject.verifyLibrary &&
		injectorObject.verifyLibrary() == version
	) return;

	function log() {
		if (w._CMLS && w._CMLS.debug && typeof console === 'object' && console.log) {
			var ts = (new Date());
			ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
			console.log('[WALLPAPER INJECTOR ' + version + ']', ts, [].slice.call(arguments));
		}
	}

	function debounce(fn, delay) {
		var timer = null;
		return function() {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function() {
				fn.apply(context, args);
			}, delay);
		};
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

	/**
	 * Refresh node cache
	 */
	function refreshCache() {
		log('Cache refresh requested.', { 'Current Cache': cache });
		cache.node = $(globalSettings.nodeSelector);
		cache.nodeOffset = cache.node.offset();
		cache.stickNode = $(globalSettings.stickNodeSelector);
		cache.stickPosition = cache.stickNode.offset().top;
		log('Cache refreshed.', { 'New Cache': cache });
	}

	/**
	 * Remove all event listeners in our namespace
	 */
	function clearListeners() {
		log('Clearing all window listeners in our namespace.');
		cache.w.off('.' + injectorNamespace);
		cache.wd.off('.' + injectorNamespace);
	}

	/**
	 * Checks if the background is visible within the current window
	 * @return {Boolean} true if yes, false if no
	 */
	function isBgVisible() {
		return (cache.contentNode.width() + 100 < cache.node.width());
	}

	/**
	 * Functions that deal directly with altering the background
	 * @type {Object}
	 */
	var wp = {

		transitionTimer: null,

		/**
		 * Reset background to initial state, clear listeners
		 */
		reset: function reset(callback) {
			log('Resetting background to original state.', cache.originalBackgroundStyles);

			$(globalSettings.obstructiveNodeSelector).show();

			clearListeners();

			if (cache.node.data('cmls-wallpaper-injected')) {
				log('Background currently has an injected wallpaper, removing');
				wp.doBgTransition(cache.originalBackgroundStyles, function() {
					cache.node.removeData('cmls-wallpaper-injected');
					cache.node.css(cache.originalBackgroundStyles);
					cache.contentNode.css(cache.originalContentStyles);
					cache.injectedWallpaperStyles = {};
					if (callback) callback();
				});
			} else {
				cache.node.css(cache.originalBackgroundStyles);
				cache.contentNode.css(cache.originalContentStyles);
			}

			cache.node.removeData('cmls-wallpaper-injected');
			if (callback) callback();
		},

		/**
		 * Compute the size of the current background.
		 * Modified from http://stackoverflow.com/a/30000591
		 * @return {Object}      width,height of background
		 */
		getBgImageSize: function() {
			var currentStyles = cache.node.css([
					'backgroundImage',
					'backgroundSize',
					'width',
					'height'
				]),
				cssSize = currentStyles.backgroundSize.split(' '),
				image = new Image(),
				src = currentStyles.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
				elW = parseInt(currentStyles.width.replace('px', ''), 10),
				elH = parseInt(currentStyles.height.replace('px', ''), 10),
				elDim = [elW, elH],
				compDim = [cssSize[0], (cssSize.length > 1 ? cssSize[1] : 'auto')],
				ratio;

			image.src = src;
			ratio = image.width > image.height ? image.width / image.height : image.height / image.width;

			if (cssSize[0] === 'cover') {
				if (elW > elH) {
					if (elW / elH >= ratio) {
						compDim = [elW, 'auto'];
					} else {
						compDim = ['auto', elH];
					}
				} else {
					compDim = ['auto', elH];
				}
			} else if (cssSize[0] === 'contain') {
				if (elW < elH) {
					compDim = [elW, 'auto'];
				} else {
					if (elW / elH >= ratio) {
						compDim = ['auto', elH];
					} else {
						compDim = [elW, 'auto'];
					}
				}
			} else {
				for (var i = cssSize.length; i--;) {
					if (cssSize[i].indexOf('px') > -1) {
						compDim[i] = cssSize[i].replace('px', '');
					} else if (cssSize[i].indexOf('%') > -1) {
						compDim[i] = elDim[i] * (cssSize[i].replace('%', '') / 100);
					}
				}
			}
			if (compDim[0] === 'auto' && compDim[1] === 'auto') {
				compDim = [image.width, image.height];
			} else {
				ratio = compDim[0] === 'auto' ? image.height / compDim[1] : image.width / computedDimensions[0];
				compDim = [
					compDim[0] === 'auto' ? image.width / ratio : compDim[0],
					compDim[1] === 'auto' ? image.height / ratio : compDim[1]
				];
			}
			log('Computed background size.', { width: compDim[0], height: compDim[1]});
			return { width: compDim[0], height: compDim[1] };
		},

		/**
		 * Generates new background positions with a given top value, multi-position aware.
		 * @param  {String} newTop New top position to set (without 'px')
		 * @return {String}        New positions
		 */
		generateBgPositions: function(newTop) {
			var currentPositions = cache.node.css('backgroundPosition').split(','),
				newPositions = [];
			for (var i = 0; i < currentPositions.length; i++) {
				bgPos = currentPositions[i].split(' ');
				newPositions.push(bgPos[0] + ' ' + newTop + 'px');
			}
			return newPositions.join(',');
		},

		/**
		 * Updates node with a given background image
		 * @param {Object} options Background image properties
		 */
		setBgImage: function(options) {
			var defaults = {
				backgroundAttachment: 'scroll',
				backgroundImage: null,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'top center',
				backgroundSize: 'auto'
			};
			var s = $.extend({}, defaults, options);

			log('Setting background image.', s);

			// Allows multiple backgrounds!
			if (typeof s.backgroundImage == 'object') {
				s.backgroundImage = 'url("' + s.backgroundImage.join('"), url("') + '")';
			} else {
				s.backgroundImage = 'url("' + s.backgroundImage + '")';
			}

			cache.injectedWallpaperStyles = s;
			cache.node.css(cache.injectedWallpaperStyles);
		},

		/**
		 * Uses CSS transitions to animate background entry
		 * @param  {Object} options Background styles
		 * @param  {Function} callback Optional callback to execute once complete
		 */
		doBgTransition: function(options, callback) {
			if (window.document.body.className.indexOf('csstransitions') < 0) {
				log('Browser does not support transitions, directly setting background');
				if (options.backgroundImage) wp.setBgImage(options);
				if (options.backgroundColor) wp.setBgColor(options.backgroundColor);
				if (callback) callback();
				return;
			}

			log('Beginning background transition.', options);
			cache.node.css('transition', 'background-position 0.3s, background-color 1s');

			wp.transitionTimer = setTimeout(function() {

				clearTimeout(wp.transitionTimer);
				cache.node.css(
					'backgroundPosition',
					wp.generateBgPositions('-' + (wp.getBgImageSize().height + cache.stickNode.height()))
				);
				if (options.backgroundColor)
					wp.setBgColor(options.backgroundColor);

				wp.transitionTimer = setTimeout(function() {
					clearTimeout(wp.transitionTimer);
					if (options.backgroundImage)
						wp.setBgImage(options);

					wp.transitionTimer = setTimeout(function() {
						clearTimeout(wp.transitionTimer);
						cache.node.css({
							transition: 'none'
						});
						if (callback) callback();
					}, 200);
				}, 200);

			}, 100);
		},

		/**
		 * Sets background to fixed position, top attached to the stick position
		 */
		setBgFixed: function() {
			if (cache.node.css('backgroundAttachment') == 'fixed') return;
			log('Setting background fixed.');
			cache.node.css({
				backgroundAttachment: 'fixed',
				backgroundPosition: wp.generateBgPositions(cache.stickPosition)
			});
		},

		/**
		 * Resets background to injection state
		 */
		clearBgFixed: function() {
			if (cache.node.css('backgroundAttachment') !== 'fixed') return;
			log('Clearing background fixed.', cache.injectedWallpaperStyles);
			cache.node.css(cache.injectedWallpaperStyles);
		},

		/**
		 * Updates node with a given background color
		 * @param {String} color HTML color value
		 */
		setBgColor: function(color) {
			log('Setting background color.', color);
			cache.node.css('backgroundColor', color);
		},

		/**
		 * Assign a click-through event on the wallpaper
		 * @param {Object} options clickThrough url and newWindow switch.
		 */
		setClickThrough: function(options) {
			var defaults = {
				clickThrough: null,
				newWindow: true
			};
			var s = $.extend({}, defaults, options);

			log('Setting click through.', s);

			$(w.document).on(
				'click.' + injectorNamespace,
				globalSettings.nodeSelector,
				function(e) {
					if (cache.node[0] !== e.target) return;
					if (s.newWindow) {
						log('Opening click-through in a new window.');
						return w.open(s.clickThrough);
					}
					log('Opening click-through in current window.');
					wd.location = s.clickThrough;
				}
			);

			// Hide obstructive nodes
			$(globalSettings.obstructiveNodeSelector).hide();

			// Set mouse to show click pointer on hover
			cache.node[0].style.cursor = 'pointer';

			// Set mouse to show default pointer over content area, give it a shadow
			cache.contentNode.css({
				cursor: 'default',
				boxShadow: '0 0 20px rgba(0,0,0,0.3)'
			});
		},

		/**
		 * Get current height of the "top" position background container should stick to
		 * @return {Number} Current "top" position of node considered top of the page
		 */
		getStickPosition: function() {
			log('Fetching stick position');
			cache.stickPosition = cache.stickNode.offset().top;
			return cache.stickPosition;
		},

		/**
		 * Checks if scroll position has passed the "stick" position
		 * @return {Boolean} true if yes, false if no
		 */
		passedStickPosition: function() {
			// Bounce if we don't have a node to check yet
			if ( ! cache.node) return false;

			var scrollTop = cache.w.scrollTop();
			if (cache.node.offset().top < scrollTop + cache.stickPosition + globalSettings.tolerance) {
				return true;
			}
			return false;
		},

		/**
		 * Start tracking scroll position
		 * @return {[type]} [description]
		 */
		startTrackingScroll: function() {
			// Refresh stickPosition
			wp.getStickPosition();

			// Set fixed position if we're passed stick position
			function checkScrollPosition() {
				if(wp.passedStickPosition()) {
					wp.setBgFixed();
				} else if (cache.node.css('backgroundAttachment') == 'fixed') {
					wp.clearBgFixed();
				}				
			}

			// Check if we've passed stick position on window scroll
			cache.w.on(
				'scroll.' + injectorNamespace,
				throttle(function() { checkScrollPosition(); }, globalSettings.debounceDelay)
			);

			// Check scroll immediately
			checkScrollPosition();

			// Refresh the stick position whenever window is resized
			cache.w.on('resize.' + injectorNamespace, debounce(function() {
				wp.getStickPosition();

				if ( ! isBgVisible()) {
					log('Background would not be visible, resetting.');
					wp.reset();
				}
			}, 500));
		}

	};

	function processWallpaper(options) {
		log('Caught wallpaper request.', options);

		// Make sure there's actually visible space for a background
		if ( ! isBgVisible()) {
			log('Background would not be visible, skipping request.');
			return;
		}

		// Defaults
		var defaults = {
			backgroundImage: null,
			backgroundRepeat: 'no-repeat',
			backgroundColor: null,
			backgroundSize: 'auto',
			clickThrough: null,
			newWindow: true,
			trackPosition: true
		};
		var s = $.extend({}, defaults, options);

		log ('Processing wallpaper', s);

		var postActions = [];

		// Do we have a background image?
		if (s.backgroundImage) {
			var bgSettings = {
				backgroundImage: s.backgroundImage,
				backgroundRepeat: s.backgroundRepeat				
			};
			if (s.backgroundColor) {
				bgSettings.backgroundColor = s.backgroundColor;
			}
			wp.doBgTransition(bgSettings, function() {
				if (s.trackPosition) wp.startTrackingScroll();
			});
		} else if (s.backgroundColor) {
			wp.setBgColor(s.backgroundColor);
		}

		// Do we have a click-through?
		if (s.clickThrough) {
			wp.setClickThrough({
				clickThrough: s.clickThrough,
				newWindow: s.newWindow
			});
		}

		// Should we monitor scrolling position?
		if (s.trackPosition) {
			wp.startTrackingScroll();
		}

		// Store background state
		cache.node.data('cmls-wallpaper-injected', 1);

	}

	function processInjectorObject() {
		injectorObject = w[injectorNamespace] || [];
		if (injectorObject && injectorObject.length) {
			processWallpaper(injectorObject.slice(-1)[0]);
			w[injectorNamespace] = [];
		} else {
			wp.reset();
		}
	}

	/**
	 * Hook into googletag render event and process new requests as they come in
	 */
	w.googletag = w.googletag || {};
	w.googletag.cmd = w.googletag.cmd || [];
	googletag.cmd.push(function() {
		googletag.pubads().addEventListener('slotRenderEnded', function(e) {
			if (e.slot.o.pos == 'wallpaper-ad') {
				log('Caught googletag render on position "wallpaper-ad."', injectorObject);
				processInjectorObject();
			}
		});
	});

	/**
	 * Initialize library and start listening!
	 */
	$(function() {
		// Act on most recent request
		if (injectorObject && injectorObject.length) {
			log('Found existing injection requests', injectorObject);
			processInjectorObject();
		}

		log('Initialized.');
	});

}(jQuery, window));