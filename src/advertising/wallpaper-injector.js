/**
 * Watches for wallpaper ad load, injects it behind content area.
 */
(function ($, window, undefined) {

	var settings = {
		// ID of wallpaper ad's slot div
		dfpSlotNode: '#div-gpt-ad-1418849849333-16',

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
	};

	/*-----------------------------------------------------------------------------------------*/

	var scriptName = 'WALLPAPER INJECTOR',
		nameSpace = 'cmlsWallpaperInjector',
		version = '0.3';

	// Only run once
	if (window._CMLS[nameSpace]) {
		return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	/**
	 * Discover transition events supported by the current browser
	 * @return {string} Transition event name
	 */
	function determineTransitionEvents() {
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition': 'transitionend',
			'OTransition': 'otransitionend',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkittransitionend',
			'msTransition': 'mstransitionend'
		};

		for(t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
	}
	settings.transitionEvent = determineTransitionEvents();

	window._CMLS[nameSpace] = {
		version: version,
		cache: {},

		refreshCache: function refreshCache() {
			this.cache.dfpSlot = $(settings.dfpSlotNode);
			this.cache.injectionNode = $(settings.injectionNode);
			this.cache.stickNode = $(settings.stickNod);
			this.cache.stickAt = this.cache.stickNode.length ? this.cache.stickNode.offset().top : 0;
			this.cache.contentNode = $(settings.contentNode);
			this.cache.footerNode = $(settings.footerNode);
			this.cache.obstructiveNode = $(settings.obstructiveNode);
			this.cache.window = $(window);
			this.cache.document = $(window.document);
		},

		refreshStickAtPosition: function refreshStickAtPosition() {
			log('Refreshing stick position.');
			this.cache.stickAt = this.cache.stickNode.length ? this.cache.stickNode.offset().top : 0;
			return this.cache.stickAt;
		},

		getContainer: function getContainer() {
			if (this.cache.container && this.cache.container.length) {
				return this.cache.container;
			}
			var existing = $('#' + nameSpace + 'Container');
			if (existing.length) {
				this.cache.container = existing;
				return this.cache.container;
			}
			log('Generating new wallpaper container.');
			var container = $('<div id="' + nameSpace + 'Container" class="' + nameSpace + '-container" />');
			this.cache.injectionNode.prepend(container);
			this.cache.container = container;
			this.raiseContentArea();
			return this.cache.container;
		},

		raiseContentArea: function raiseContentArea() {
			var container = this.getContainer();
			var originalStyles = {
				content: this.cache.contentNode.css(['position', 'zIndex']),
				footer: this.cache.footerNode.css(['position', 'zIndex'])
			};
			if (originalStyles.content.position.toLowerCase() === 'static') {
				log('Setting content area position to relative.');
				this.cache.contentNode.css('position', 'relative');
			}
			if (
				originalStyles.content.zIndex.toLowerCase() === 'auto' ||
				originalStyles.content.zIndex <= container.css('zIndex')
			) {
				log('Raising content area above wallpaper container.');
				this.cache.contentNode.css('zIndex', container.css('zIndex') + 1);
			}
			if (originalStyles.footer.position.toLowerCase() === 'static') {
				log('Setting footer area position to relative.');
				this.cache.footerNode.css('position', 'relative');
			}
			this.cache.contentNode.data('originalStyles', originalStyles.content);
			this.cache.footerNode.data('originalStyles', originalStyles.footer);
			log('Content area has been raised.');
		},

		show: function show() {
			log('Displaying wallpaper.');
			var container = this.getContainer();
			container
				.off(settings.transitionEvent)
				.addClass(nameSpace + '-open');
			this.cache.obstructiveNode.hide();
			this.startTrackingScroll();
		},

		reset: function reset(callback) {
			var container = this.getContainer();
			log('Removing wallpaper.');

			var that = this;

			// Wrapping the last bit of cleanup so we can
			// execute at transition end if available.
			function callbackWrapper() {
				log('Removing wallpaper contents.');
				container
					.empty()
					.css('top', '0');
				that.cache.obstructiveNode.show();

				log('Clearing event listeners.');
				that.cache.window.off('.' + nameSpace);
				that.cache.document.off('.' + nameSpace);

				if (typeof callback === 'function') {
					log('Firing reset callback.');
					callback();
				}
			}

			var isOpen = container.hasClass(nameSpace + '-open');

			container
				.off(settings.transitionEvent)
				.removeData()
				.removeProp('data')
				.css('backgroundColor', 'rgba(0,0,0,0)')
				.removeClass(nameSpace + '-open')
				.removeClass(nameSpace + '-fixed');

			if (settings.transitionEvent && isOpen) {
				log('Setting transition watch.');
				container.on(settings.transitionEvent, function(e) {
					log('Transition complete.', e.originalEvent.propertyName);
					// Assume opacity takes longest
					if (e.originalEvent.propertyName === 'opacity') {
						e.stopImmediatePropagation();
						callbackWrapper();
					}
				});
			} else {
				callbackWrapper();
			}
		},

		setFixed: function setFixed(force) {
			var container = this.getContainer();
			if (container.hasClass(nameSpace + '-fixed') && force !== true) {
				return;
			}
			log('Setting wallpaper position to fixed.');
			container
				.addClass(nameSpace + '-fixed')
				.css('top', this.cache.stickAt);
		},

		unsetFixed: function unsetFixed() {
			var container = this.getContainer();
			if ( ! container.hasClass(nameSpace + '-fixed')) {
				return;
			}
			log('Unfixing wallpaper position.');
			container
				.removeClass(nameSpace + '-fixed')
				.css('top', '0');
		},

		hasPassedStickPosition: function hasPassedStickPosition() {
			var scrollTop = this.cache.window.scrollTop(),
				offset = this.cache.injectionNode.length ? this.cache.injectionNode.offset().top : 0;
			if (offset < scrollTop + this.cache.stickAt) {
				return true;
			}
			return false;
		},

		startTrackingScroll: function startTrackingScroll() {
			log('Initializing scroll tracking.');
			var that = this;

			this.refreshStickAtPosition();

			if (this.hasPassedStickPosition()) {
				this.setFixed(true);
			} else {
				this.unsetFixed();
			}

			this.cache.window.on('scroll.' + nameSpace, window._CMLS.throttle(function() {
				if (that.hasPassedStickPosition()) {
					that.setFixed();
					return;
				}
				that.unsetFixed();
			}, 60));

			this.cache.window.on('resize.' + nameSpace, window._CMLS.debounce(function() {
				that.refreshStickAtPosition();
			}, 500));

			log('Scroll tracking enabled.');
		},

		process: function process() {
			log('Processing wallpaper request.');
			this.refreshCache();
			var container = this.getContainer(),
				that = this;

			log('Retrieving data from ad slot.');
			var slotIframe = this.cache.dfpSlot.find('iframe'),
				slotDiv = slotIframe.contents().find('#google_image_div,body').first(),
				slotLink = slotDiv.find('a:first'),
				slotImage = slotLink.find('img.img_ad:first,img').first(),
				slotBgColor = slotImage.prop('alt');

			log('Checking image.');
			if ( ! slotImage.length) {
				log('No image found in ad slot!');
				this.reset();
				return;
			}

			log('Checking background color.', slotBgColor);
			var bgColor = 'rgba(255,255,255,0)';
			if (slotBgColor && slotBgColor.length > 1) {
				log('Background color attempted, checking...');
				var bgColorCheck = slotBgColor.match(/(\#[A-Za-z0-9]+)/);
				if (bgColorCheck && bgColorCheck.length > 1) {
					log('Using background color.', bgColorCheck[1]);
					bgColor = bgColorCheck[1];
				}
			}

			this.reset(function buildWallpaper() {
				log('Building new wallpaper.');
				var iframe = $('<iframe />')
					.prop('name', nameSpace + 'Iframe')
					.prop('scrolling', 'no')
					.prop('marginwidth', '0')
					.prop('marginheight', '0')
					.prop('frameborder', '0')
					.prop('src', 'about:blank')
					.prop('width', slotIframe.prop('width'))
					.prop('height', slotIframe.prop('height'))
					.css({
						'border': 0,
						'verticalAlign': 'bottom'
					});
				
				log('Injecting wallpaper into container.');
				container
					.css('backgroundColor', bgColor)
					.append(iframe);

				iframe.contents()
					.find('head')
						.append('<style>html,body { margin: 0; padding: 0; }</style>')
					.end()
					.find('body')
						.append(
							'<a href="' + slotLink.prop('href') + '" target="' + slotLink.prop('target') +'">' +
								'<img src="' + slotImage.prop('src') + '">' +
							'</a>'
						);

				if (slotImage.length) {
					log('Initializing load watch for ad image.');
					$('<img/>')
						.bind('load', function() {
							that.show();
							$(this).remove();
						})
						.prop('src', slotImage.prop('src'));
				} else {
					that.show();
				}
			});
		},

		init: function init() {
			log('Initializing');

			this.refreshCache();

			var that = this;

			// Hook into ad render event to intercept requests
			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];
			window.googletag.cmd.push(function() {
				window.googletag.pubads().addEventListener('slotRenderEnded', function(e) {
					var pos = e.slot.getTargeting('pos');
					if (pos.indexOf('wallpaper-ad') > -1) {

						log('Caught render event for wallpaper-ad', e.slot.getSlotElementId());
						if (e.isEmpty) {

							log('Slot was empty, resetting wallpaper container.');
							that.reset();

						} else {

							log('Slot contained an ad, processing wallpaper.', that);
							that.process();

						}
						return false;
					}
				});
			});

			var styleSheet = '<style id="' + nameSpace + 'Styles">' +
				'.' + nameSpace + '-container {' +
					'display: block !important;' +
					'position: absolute;' +
					'z-index: 0;' +
					'top: 0;' +
					'left: 0;' +
					'height: 0 !important;' +
					'width: 100% !important;' +
					'overflow: hidden;' +
					'text-align: center;' +
					'transition: opacity 0.4s, height 0.5s, background-color 0.3s;' +
					'opacity: 0;' +
				'}' +
				'.' + nameSpace + '-container iframe {' +
					'position: absolute;' +
					'left: 50%;' +
					'transform: translate(-50%, 0%);' +
				'}' +
				'.' + nameSpace + '-open {' +
					'height: 100% !important;' +
					'opacity: 1;' +
				'}' +
				'.' + nameSpace + '-open ~ .grid-container {' +
					'box-shadow: 0 0 20px rgba(0,0,0,0.3);' +
					'transition: box-shadow 0.5s' +
				'}' +
				'.' + nameSpace + '-fixed {' +
					'position: fixed;' +
				'}' + 
				settings.dfpSlotNode + ' {' +
					'display: none !important;' +
				'}' +
			'</style>';
			if ( ! window.document.getElementById(nameSpace + 'Styles')) {
				$('head').append(styleSheet);
			}

		}

	};

	$(function() {
		window._CMLS[nameSpace].init();
	});


}(jQuery, window));