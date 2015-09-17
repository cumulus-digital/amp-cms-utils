/* globals googletag */
(function ($, window, undefined) {

	var nameSpace = 'cmlsWallpaperInjector',
		version = '0.12',
		injecting = false;

	// If library is already defined, bounce.
	if (window._CMLS && window._CMLS[nameSpace + 'Injected']) {
		return;
	}

	var global = {
			settings: {
				// Node selector for where to inject wallpaper
				injectionNode: '.wrapper-content',

				// Node selector for determining stick position on scroll.
				// Wallpaper will stick once it scrolls to the initial TOP
				// position of this node.
				stickNode: '.wrapper-header',

				// Content area selector
				contentNode: '.wrapper-content .grid-container:first',

				// Footer selector
				footerNode: '.wrapper-footer',

				// Node selectors to hide/show along with wallpaper changes.
				obstructiveNode: '.takeover-left, .takeover-right, .skyscraper-left, .skyscraper-right'
			},
			cache: {}
		},
		defaults = {
			backgroundImage: null,
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'auto',
			backgroundPosition: 'center top',
			backgroundColor: null,
			clickThrough: null,
			newWindow: true,
			trackPosition: true
		};

	window[nameSpace] = window[nameSpace] || [];

	var styleSheet = '<style id="' + nameSpace + 'Styles">' +
			'.' + nameSpace + '-base {' +
				'background-position: 50% -4000px;' +
				'position: absolute;' +
				'z-index: 0;' +
				'top: 0;' +
				'right: 0;' +
				'bottom: 0;' +
				'left: 0;' +
			'}' +
			'.' + nameSpace + '-out {' +
				'background-position: 50% -4000px;' +
				'-webkit-transition: background-position 0.8s, background-color 0.7s;' +
				'-moz-transition: background-position 0.8s, background-color 0.7s;' +
				'-o-transition: background-position 0.8s, background-color 0.7s;' +
				'-ms-transition: background-position 0.8s, background-color 0.7s;' +
				'transition: background-position 0.8s, background-color 0.7s;' +
			'}' +
			'.' + nameSpace + '-in {' +
				'background-position: 50% 0%;' +
				'-webkit-transition: background-position 0.4s, background-color 0.7s;' +
				'-moz-transition: background-position 0.4s, background-color 0.7s;' +
				'-o-transition: background-position 0.4s, background-color 0.7s;' +
				'-ms-transition: background-position 0.4s, background-color 0.7s;' +
				'transition: background-position 0.4s, background-color 0.7s;' +
			'}' +
			'' + global.settings.contentNode + ' {' +
				'-webkit-transition: box-shadow 1s;' +
				'-moz-transition: box-shadow 1s;' +
				'-o-transition: box-shadow 1s;' +
				'-ms-transition: box-shadow 1s;' +
				'transition: box-shadow 1s;' +
			'}' +
			'.' + nameSpace + '-in ~ .grid-container {' +
				'box-shadow: 0 0 20px rgba(0,0,0,0.3);' +
			'}' +
			'.' + nameSpace + '-fixed {' +
				'position: fixed;' +
				'top: 0;' +
			'}' +
		'</style>';
	if ( ! window.document.getElementById(nameSpace + 'Styles')) {
		$('head').append(styleSheet);
	}

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			var ts = (new Date());
			ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
			console.log('[WALLPAPER INJECTOR ' + version + ']', ts, [].slice.call(arguments));
		}
	}

	function refreshGlobalCache() {
		global.cache.node = $(global.settings.injectionNode);
		global.cache.stickNode = $(global.settings.stickNode);
		global.cache.stickAt = global.cache.stickNode.offset().top;
		global.cache.contentNode = $(global.settings.contentNode);
		global.cache.footerNode = $(global.settings.footerNode);
		global.cache.window = $(window);
		global.cache.document = $(window.document);
		global.cache.obstructiveNode = $(global.settings.obstructiveNode);
	}
	refreshGlobalCache();

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

	var wallpaper = {

		bgNode: null,

		getBackgroundNode: function() {
			if (wallpaper.bgNode && wallpaper.bgNode.length) {
				return wallpaper.bgNode;
			}
			var testNode = global.cache.node.children('#' + nameSpace + 'Node');
			if (testNode.length) {
				log('Wallpaper container exists but is not cached.');
				wallpaper.bgNode = testNode;
			} else {
				log('Injecting wallpaper container.');
				var bgNode = $('<div id="' + nameSpace + 'Node" />');
				global.cache.node.prepend(bgNode);
				wallpaper.bgNode = $('#' + nameSpace + 'Node');
				wallpaper.bgNode.addClass(nameSpace + '-base').css('zIndex');
				wallpaper.raiseContentArea();
			}
			return wallpaper.bgNode;
		},

		getCurrentRequestData: function() {
			var bgNode = wallpaper.getBackgroundNode(),
				data = null;
			log('Retrieving current wallpaper settings.', $.hasData(bgNode[0]));
			if ($.hasData(bgNode[0]) && bgNode.data('requestOptions')) {
				data = bgNode.data('requestOptions');
			}
			log('Current wallpaper settings:', data);
			return data;
		},

		clearListeners: function() {
			log('Clearing all event listeners.');
			global.cache.window.off('.' + nameSpace);
			global.cache.document.off('.' + nameSpace);
		},

		reset: function(callBack, newBackgroundColor) {
			log('Resetting.');

			refreshGlobalCache();
			wallpaper.clearListeners();
			global.cache.obstructiveNode.show();

			var bgNode = wallpaper.getBackgroundNode();

			function finishReset() {
				log('RESET: Clearing wallpaper.');
				bgNode
					.removeClass(nameSpace + '-out')
					.attr('style', '')
					.css('backgroundColor', newBackgroundColor);
				wallpaper.bgNode = null;
				if (callBack) {
					log('RESET: Firing callback.');
					callBack();
				} else {
					log('RESET: No callback specified, wallpaper is reset.');
				}
			}

			bgNode
				.removeData()
				.removeAttr('data')
				.addClass(nameSpace + '-out')
				.removeClass(nameSpace + '-in')
				//.removeClass(nameSpace + '-fixed')
				.css('backgroundPosition', '');

			if ( ! newBackgroundColor) {
				newBackgroundColor = 'transparent';
			}
			bgNode.css('backgroundColor', newBackgroundColor);

			if ($('html').hasClass('csstransitions')) {
				log('RESET: Waiting for transition.');
				var timer = 300;
				if (bgNode.css('backgroundImage') !== 'none') { 
					log('RESET: Already has a wallpaper, increasing transition timer.', bgNode.css('backgroundImage'));
					timer = 600;
				}
				setTimeout(function() {
					if ( ! window._CMLS.skip) {
						finishReset();
					}
				}, timer);
			} else {
				finishReset();
			}
		},

		setBackgroundFixed: function(force) {
			var bgNode = wallpaper.getBackgroundNode();
			if (bgNode.hasClass(nameSpace + '-fixed') && force !== true) {
				return;
			}
			bgNode.addClass(nameSpace + '-fixed');
			bgNode.css(
				'top',
				global.cache.stickAt
			);
		},
		clearBackgroundFixed: function() {
			var bgNode = wallpaper.getBackgroundNode();
			if ( ! bgNode.hasClass(nameSpace + '-fixed')) {
				return;
			}
			bgNode.removeClass(nameSpace + '-fixed')
				.css('top', '');
		},
		refreshStickPosition: function() {
			log('Refreshing stick position.');
			global.cache.stickAt = global.cache.stickNode.offset().top;
			return global.cache.stickAt;
		},
		passedStickPosition: function() {
			var scrollTop = global.cache.window.scrollTop(),
				offset = global.cache.node.offset().top;
			if (offset < scrollTop + global.cache.stickAt) {
				return true;
			}
			return false;
		},
		checkScrollPosition: function(force) {
			if (wallpaper.passedStickPosition()) {
				wallpaper.setBackgroundFixed(force);
				return;
			}
			wallpaper.clearBackgroundFixed();
		},
		startTrackingScroll: function() {
			log('Initializing scroll tracking.');
			var bgNode = wallpaper.getBackgroundNode();
			wallpaper.refreshStickPosition();

			wallpaper.checkScrollPosition(true);
			bgNode.data('trackingScroll', 1);

			global.cache.window.on('scroll.' + nameSpace, throttle(function() {
				wallpaper.checkScrollPosition();
			}, 60));

			global.cache.window.on('resize.' + nameSpace, debounce(function() {
				wallpaper.refreshStickPosition();
			}, 480));
		},

		raiseContentArea: function() {
			log('Raising content area above wallpaper container.');
			var bgNode = wallpaper.getBackgroundNode();
			var originalContentStyle = global.cache.contentNode.css(['position', 'zIndex']);
			var originalFooterStyle = global.cache.footerNode.css(['position', 'zIndex']);
			if (originalContentStyle.position === 'static') {
				log('Setting content area position to relative.');
				global.cache.contentNode.css('position', 'relative');
			}
			if (originalContentStyle.zIndex === 'auto' || originalContentStyle.zIndex <= bgNode.css('zIndex')) {
				log('Setting content area z-index.');
				global.cache.contentNode.css('zIndex', bgNode.css('zIndex') + 1);
			}
			if (originalFooterStyle.position === 'static') {
				log('Setting footer position to relative.');
				global.cache.footerNode.css('position', 'relative');
			}
			global.cache.contentNode.data('originalStyles', originalContentStyle);
			global.cache.footerNode.data('originalStyles', originalFooterStyle);
			log('Content area raised.');
		},

		lowerContentArea: function() {
			if ($.hasData(global.cache.contentNode[0]) && global.cache.contentNode.data('originalStyles')) {
				global.cache.contentNode.css(global.cache.contentNode.data('originalStyles'));
			}
			if ($.hasData(global.cache.footerNode[0]) && global.cache.footerNode.data('originalStyles')) {
				global.cache.footerNode.css(global.cache.footerNode.data('originalStyles'));
			}
		},

		injectClickThrough: function(href, newWindow) {
			var bgNode = wallpaper.getBackgroundNode(),
				link = $('<a/>');
			bgNode.children('a').remove();
			link.css({
				display: 'block',
				height: '100%',
				width: '100%'
			}).attr('href', href);
			if (newWindow) {
				link.attr('target', '_blank');
			}
			bgNode.append(link);
			global.cache.obstructiveNode.hide();
		},

		generate: function(options) {
			log('Generating wallpaper injection.');

			var settings = $.extend({}, defaults, options);

			var bgNode = wallpaper.getBackgroundNode(),
				newStyle = {};

			if (settings.backgroundImage) {
				newStyle.backgroundImage = 'url("' + settings.backgroundImage + '")';
				newStyle.backgroundRepeat = settings.backgroundRepeat;
				newStyle.backgroundSize = settings.backgroundSize;
				//newStyle.backgroundPosition = settings.backgroundPosition;
			}

			if (settings.backgroundColor) {
				newStyle.backgroundColor = settings.backgroundColor;
			}

			if (settings.clickThrough) {
				wallpaper.injectClickThrough(settings.clickThrough, settings.newWindow);
			}

			function display() {
				log('Displaying new wallpaper.', newStyle);
				bgNode.css(newStyle)
					.addClass(nameSpace + '-in')
					.removeClass(nameSpace + '-out');
				injecting = false;
			}

			bgNode.data('requestOptions', settings);

			// Preload image before display
			if (settings.backgroundImage) {
				log('Preloading new wallpaper image.');
				bgNode.addClass(nameSpace + '-out');
				$('<img/>').load(function() {
					$(this).remove();
					display();
				}).attr('src', settings.backgroundImage);
			} else {
				display();
			}

			if (settings.trackPosition) {
				wallpaper.startTrackingScroll();
			}
		}
	};

	function resetRequestArray() {
		window[nameSpace] = new WallpaperInjectorArray();
	}

	function process(options) {
		injecting = true;
		refreshGlobalCache();

		// Wait for contentNode to exist and have content
		if (global.cache.contentNode.width() < 100) {
			setTimeout(function() {
				process(options);
			}, 480);
			return;
		}

		log('Content node ready.');

		if ( ! options && window[nameSpace]) {
			options = window[nameSpace].slice(-1)[0];
		}

		if ( ! window[nameSpace] || ! window[nameSpace].length) {
			log('Received empty request, resetting wallpaper.');
			wallpaper.reset();
			return;
		}

		// Clear request object
		resetRequestArray();

		var settings = $.extend({}, defaults, options);
		log('Processing request:', settings);

		// Compare request to current wallpaper
		var currentWallpaper = wallpaper.getCurrentRequestData();
		
		log('Testing current wallpaper against request.', currentWallpaper, settings);
		if (
			currentWallpaper &&
			currentWallpaper.backgroundImage === settings.backgroundImage &&
			currentWallpaper.backgroundRepeat === settings.backgroundRepeat &&
			currentWallpaper.backgroundSize === settings.backgroundSize &&
			currentWallpaper.backgroundPosition === settings.backgroundPosition &&
			currentWallpaper.backgroundColor === settings.backgroundColor &&
			currentWallpaper.newWindow === settings.newWindow &&
			currentWallpaper.trackPosition === settings.trackPosition
		) {
			log('Requested wallpaper is already set.');
			return;
		}

		log('Generating wallpaper.');
		wallpaper.reset(function() {
			wallpaper.generate(settings);
		}, settings.backgroundColor);

	}

	// Array mock allows us to define wallpapers before library loads
	var WallpaperInjectorArray = function() {};
	WallpaperInjectorArray.prototype = [];
	WallpaperInjectorArray.prototype.verifyLibrary = function() {
		return version;
	};
	WallpaperInjectorArray.prototype.originalPush = WallpaperInjectorArray.prototype.push;
	WallpaperInjectorArray.prototype.push = function() {
		log('Push has been called on Injector Array.');
		for (var i = 0; i < arguments.length; i++) {
			this.originalPush(arguments[i]);
		}
		process();
	};


	// Initialize library
	$(function() {
		if (window[nameSpace] && window[nameSpace].length) {
			log('Found existing injection request, processing...', window[nameSpace]);
			process();
		}

		// Hook into googletag render event to process empty requests
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		googletag.cmd.push(function() {
			googletag.pubads().addEventListener('slotRenderEnded', function(e) {
				var pos = e.slot.getTargeting('pos');
				if (pos.toLowerCase() === 'wallpaper-ad' || (pos.length && pos.indexOf('wallpaper-ad') > -1)) {
					log('Caught googletag render on position "wallpaper-ad"!', JSON.stringify(window[nameSpace]));
					if (e.isEmpty) {
						log('Googletag render contained no request, considering this a reset request.');
						throttle(process(), 2000);
					} else {
						log('Googletag render contained a request, letting request fall to WallpaperInjectorArray handler.');
					}
				}
			});
		});

		resetRequestArray();

		window._CMLS[nameSpace + 'Injected'] = 1;
		log('Initialized.');
	});
}(jQuery, window));