/**
 * Wallpaper injection for AMP CMS
 */
(function($, window, undefined) {

	"use strict";

	var injectorNamespace = 'cmlsWallpaperInjector',
		injectorObject = window[injectorNamespace],
		version = '0.9';

	// Settings
	var settings = {

		// Node selector for where to inject background
		nodeSelector: '.wrapper-content',

		// Node selector for where to determine stick position
		stickNodeSelector: '.wrapper-header',

		// Node selector for content area
		contentNodeSelector: '.wrapper-content .grid-container:first',

		// Padding for scroll position check
		tolerance: 0,

		// Delay between each reading of scroll position
		debounceDelay: 50
	};

	// Initial caches
	var $node = $(settings.nodeSelector),
		$stickNode = $(settings.stickNodeSelector),
		$contentNode = $(settings.contentNodeSelector),
		$window = $(window);
	var cache = {
		window: $window,
		node: $node,
		nodeOffset: $node.offset(),
		stickNode: $stickNode,
		contentNode: $contentNode,
		originalBackgroundStyles: $node.css([
			'backgroundImage',
			'backgroundColor',
			'backgroundAttachment',
			'backgroundPosition',
			'backgroundRepeat',
			'cursor'
		]),
		originalContentStyles: {
			'boxShadow': $contentNode.css('boxShadow')
		}
	};

	// If library is already defined, bounce.
	if (
		injectorObject &&
		injectorObject.verifyLibrary &&
		injectorObject.verifyLibrary() === version
	) return;

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
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

	// Refresh node cache
	function refreshCache() {
		log('Cache refresh requested.  Current cache:', cache);
		cache.node = $(settings.nodeSelector);
		cache.nodeOffset = cache.node.offset();
		cache.stickNode = $(settings.stickNodeSelector);
		cache.stickPosition = cache.stickNode.offset().top;
		log('Cache refreshed.  New cache:', cache);
	}

	// Fetch current height of the "top" position to stick to
	function getStickPosition() {
		log('Fetching stick position.', cache);
		cache.stickPosition = cache.stickNode.offset().top;
		return cache.stickPosition;
	}


	// Check if current scroll position passed the stick position
	function checkScrollPosition() {
		if ( ! cache.node) return false;

		var scrollTop = cache.window.scrollTop();

		if (cache.node.offset().top < scrollTop + cache.stickPosition + settings.tolerance) {
			return true;
		}
		return false;
	}

	// Check if there's visible space for a background change by
	// comparing content node's width to insertion node's width
	function checkSpaceForBackground() {
		if (cache.contentNode.width() + 100 < cache.node.width()) return true;
		return false;
	}

	// Set background fixed
	function setBackgroundFixed(check) {
		if ( ! cache.node) return false;

		if (check && cache.node.css('backgroundAttachment')  == 'fixed') return;
		log('Setting background fixed.');
		cache.node.css({
			backgroundAttachment: 'fixed',
			backgroundPosition: 'center ' + cache.stickPosition + 'px'
		});
	}

	// Remove background fixed
	function clearBackgroundFixed(check) {
		if ( ! cache.node) return false;

		if (check && cache.node.css('backgroundAttachment') !== 'fixed') return;
		log('Clearing background fixed.');
		cache.node.css({
			backgroundAttachment: 'scroll',
			backgroundPosition: 'center top'
		});
	}

	// Reset background to original settings
	function resetBackground() {
		if ( ! cache.node || cache.node.data('cmls-wallpaper-injected') !== 1) return false;

		log('Resetting background to original state.', cache.originalBackgroundStyles);

		cache.node.css(cache.originalBackgroundStyles);

		clearListeners();

		cache.contentNode.css('boxShadow', cache.originalContentStyles.boxShadow);

		$('.takeover-left, .takeover-right, .skyscraper-left, .skyscraper-right').show();

		// Reset background state data
		cache.node.removeData('cmls-wallpaper-injected');
	}

	function doClickThrough(e) {
		if (cache.node !== e.target) return;
		if (newWindow) {
			return window.open(href);
		}
		window.location.href = href;
	}

	// Set a click event on the background
	function setClickThrough(href, newWindow) {
		log('Setting click through.', settings.nodeSelector);
		$(window.document).on('click.' + injectorNamespace, settings.nodeSelector, doClickThrough);
		
		// Set mouse to show click pointer when hovering over node
		cache.node[0].style.cursor = 'pointer';
		
		// Remove the skyscrapers
		$('.takeover-left, .takeover-right, .skyscraper-left, .skyscraper-right').hide();

		cache.contentNode.css({
			cursor: 'default',
			boxShadow: '0 0 20px rgba(0,0,0,0.3)'
		});
	}

	// Monitor scroll and update stickPosition on resize
	function monitorScroll() {
		getStickPosition();

		cache.window.on('scroll.' + injectorNamespace, throttle(function() {
			var scrollPositionCheck = checkScrollPosition();
			if (scrollPositionCheck) { 
				setBackgroundFixed(1);
			} else if (cache.node[0].style.backgroundAttachment == 'fixed') {
				clearBackgroundFixed(1);
			}
		}, settings.debounceDelay));

		cache.window.on('resize.' + injectorNamespace, debounce(function() {
			// Update Stick Position
			getStickPosition();

			if ( ! checkSpaceForBackground()) {
				log('No room to display background, resetting.');
				resetBackground();
			}
		}, 300));
	}

	// Clear all event listeners in our namespace
	function clearListeners() {
		log('Clearing all window listeners.');
		cache.window.off('.' + injectorNamespace);
		$(window.document).off('.' + injectorNamespace);
	}

	/**
	 * Set wallpaper with given options
	 * {
	 * 	backgroundImage: 'http://...'	URL to background image (default null)
	 * 	backgroundRepeat: '...'			Background repeat property (default 'no-repeat')
	 * 	backgroundColor: '...'			Background color (default null)
	 * 	clickThrough: 'http://...'		Click through URL for background container (default null)
	 * 	newWindow: true | false			Open click through in a new window (default true)
	 * 	trackPosition: true | false		Track scroll position and fix background if it 
	 * 									passes stickPosition (default true)
	 * }
	 */
	function setWallpaper(options) {

		log('Caught wallpaper request.', options);

		refreshCache();

		// First, reset background
		if (cache.node.data('cmls-wallpaper-injected') == 1) resetBackground();

		if ( ! checkSpaceForBackground()) {
			log('No room to display background, skipping request.');
			return;
		}

		// Defaults
		var defaults = {
			backgroundImage: null,
			backgroundRepeat: 'no-repeat',
			backgroundColor: null,
			clickThrough: null,
			newWindow: true,
			trackPosition: true
		};
		options = $.extend({}, defaults, options);

		log('Normalized options:', options);

		var newStyles = {};

		// Set our given background image, if specified
		if (options.backgroundImage && options.backgroundImage.length) {
			log('Setting background image.', options.backgroundImage);
			cache.node.css({
				background: 'transparent',
				backgroundColor: 'transparent',
				backgroundImage: 'url("' + options.backgroundImage + '")',
				backgroundRepeat: options.backgroundRepeat,
				backgroundPosition: '0 0'
			});
			if (checkScrollPosition()) {
				setBackgroundFixed();
			} else {
				clearBackgroundFixed();
			}
		}

		// Set our given background color, if specified
		if (options.backgroundColor && options.backgroundColor.length) {
			log('Setting background color.', options.backgroundColor);
			cache.node.css('backgroundColor', options.backgroundColor);
		}

		// Set our given click through, if specified.
		if (options.clickThrough && options.clickThrough.length) {
			log('Setting click through.', options.clickThrough);
			setClickThrough(options.clickThrough, options.newWindow);
		}

		// Start tracking window position, if specified.
		if (options.trackPosition) {
			log('Tracking position.', options.trackPosition);
			monitorScroll();
		}

		// Store background state
		cache.node.data('cmls-wallpaper-injected', 1);

	}

	// Main entrypoint for injections through injector push
	function injectWallpaper(options) {
		log('Inecting!');
		$(function() { setWallpaper(options); });
	}

	// Override the googletag debug log to listen for slot fetch event.
	// Allows us to reset the background on ad refresh to anticipate a new
	// ad not calling us at all.
	window.googletag = window.googletag || {};
	window.googletag.cmd = window.googletag.cmd || [];
	var googletag_resetBackground;
	googletag.cmd.push(function() {
		var googletag_log = googletag.debug_log.log;

		googletag.debug_log.log = function(level,message,service,slot,reference){
			if (message && message.getMessageId && typeof (message.getMessageId()) == 'number') {
				if (message.getMessageId() === 3) {
					clearTimeout(googletag_resetBackground);
					googletag_resetBackground = null;
					googletag_resetBackground = setTimeout(function() {
						resetBackground();
					}, 10);
				}
			}
			return googletag_log.apply(this,arguments);
		};
	});

	// Array mock allows us to define wallpapers before library loads
	var WallpaperInjectorArray = function() {};
	WallpaperInjectorArray.prototype = [];
	WallpaperInjectorArray.prototype.verifyLibrary = function() {
		return version;
	};
	WallpaperInjectorArray.prototype.push = function() {
		for (var i = 0; i < arguments.length; i++) {
			injectWallpaper(arguments[i]);
		}
	};

	$(function() {

		refreshCache();

		clearListeners();

		resetBackground();

		// Act on any existing requests
		if (injectorObject && injectorObject.length) {
			log('Found existing requests.');
			for (var i = 0; i < injectorObject.length; i++) {
				injectWallpaper(injectorObject[i]);
			}
		}

		// Export wallpaper injector to the global scope
		// New wallpapers are injected by push:
		// parent.cmlsWallpaperInjector = parent.cmlsWallpaperInjector || []
		// parent.cmlsWallpaperInjector.push({ options });
		window[injectorNamespace] = new WallpaperInjectorArray();

		log('Initialized.');
	});

}(jQuery, window));