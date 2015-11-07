/**
 * Injects ads loaded into wallpaper ad slot behind content area
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
		nameSpace = 'wallpaperInjector',
		version = '0.3';

	if (window._CMLS[nameSpace]) {
		return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	function WallpaperInjector(settings) {
		var cache = {},
			nameSpace = settings.nameSpace || 'wallpaperInjector',
			throttle = window._CMLS.throttle,
			debounce = window._CMLS.debounce;

		function determineTransitionEvent() {
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

		var transitionEvent = determineTransitionEvent();

		function refreshCache() {
			cache.dfpSlot = $(settings.dfpSlotNode);
			cache.injectionNode = $(settings.injectionNode);
			cache.stickNode = $(settings.stickNode);
			cache.contentNode = $(settings.contentNode);
			cache.footerNode = $(settings.footerNode);
			cache.obstructiveNode = $(settings.obstructiveNode);
			cache.window = $(window);
			cache.document = $(window.document);
			refreshStickAtPosition();
			return cache;
		}

		function refreshStickAtPosition() {
			log('Refreshing stick position.');
			cache.stickAt = cache.stickNode.length ? cache.stickNode.offset().top : 0;
			return cache.stickAt;
		}

		function getContainer() {
			if (cache.container && cache.container.length) {
				return cache.container;
			}
			var existing = $('#' + nameSpace + 'Container');
			if (existing.length) {
				cache.container = existing;
				return cache.container;
			}
			log('Generating new wallpaper container.');
			refreshCache();
			var container = $('<div />')
					.prop({
						'id': nameSpace + 'Container',
						'class': nameSpace + '-container'
					});
			cache.injectionNode.prepend(container);
			cache.container = container;
			raiseContentArea();
			return cache.container;
		}

		function raiseContentArea() {
			var container = getContainer(),
				originalStyles = {
					content: cache.contentNode.css(['position', 'zIndex']),
					footer: cache.footerNode.css(['position', 'zIndex'])
				};
			if (originalStyles.content.position === 'static') {
				log('Setting content area position to relative.');
				cache.contentNode.css('position', 'relative');
			}
			if (originalStyles.content.zIndex === 'auto' || originalStyles.content.zIndex <= container.css('zIndex')) {
				log('Raising content area above wallpaper container.');
				cache.contentNode.css('zIndex', container.css('zIndex') + 1);
			}
			if (originalStyles.footer.position === 'static') {
				log('Setting footer area position to relative.');
				cache.footerNode.css('position', 'relative');
			}
			cache.contentNode.data('originalStyles', originalStyles.content);
			cache.footerNode.data('originalStyles', originalStyles.footer);
			log('Content area has been raised.');
		}

		function show() {
			log('Displaying wallpaper.');
			var container = getContainer();
			container
				.off(transitionEvent)
				.addClass(nameSpace + '-open');
			cache.obstructiveNode.hide();
			startTrackingScroll();
		}

		function _reset() {
			var deferred = $.Deferred(),
				container = getContainer(),
				isOpen = container.hasClass(nameSpace + '-open');

			function finishRemoval() {
				log('Removing wallpaper contents.');
				container
					.empty()
					.css('top', '0');
				cache.obstructiveNode.show();
				log('Clearing all event listeners.');
				cache.window.off('.' + nameSpace);
				container.off('.' + nameSpace);

				deferred.resolve();
			}

			container
				.off(transitionEvent)
				.removeData()
				.removeProp('data')
				.css('backgroundColor', 'rgba(0,0,0,0)')
				.removeClass(nameSpace + '-open')
				.removeClass(nameSpace + '-fixed');

			if (transitionEvent && isOpen) {
				container.on(transitionEvent, function(e) {
					// Assume opacity takes longest
					if (e.originalEvent.propertyName === 'opacity') {
						log('Transition complete.');
						finishRemoval();
					}
				});
			} else {
				finishRemoval();
			}

			return deferred.promise();
		}
		this.reset = _reset;

		function isFixed() {
			var container = getContainer();
			return container.hasClass(nameSpace + '-fixed');
		}

		function toggleFixed(fix) {
			var container = getContainer();
			if (isFixed() && fix === false) {
				log('Unfixing wallpaper position.');
				container
					.removeClass(nameSpace + '-fixed')
					.css('top', '0');
			}
			if ( ! isFixed() && fix === true) {
				log('Fixing wallpaper position.');
				refreshStickAtPosition();
				container
					.addClass(nameSpace + '-fixed')
					.css('top', cache.stickAt);
			}
		}

		function startTrackingScroll() {
			log('Initializing scroll tracking.');

			function hasPassedStickPosition() {
				var scrollTop = cache.window.scrollTop(),
					offset = cache.injectionNode.length ? cache.injectionNode.offset().top : 0;
				if (offset < scrollTop + cache.stickAt) {
					return true;
				}
				return false;
			}

			refreshStickAtPosition();

			if (hasPassedStickPosition()) {
				toggleFixed(true);
			} else {
				toggleFixed(false);
			}

			cache.window.on('scroll.' + nameSpace, throttle(function() {
				if (hasPassedStickPosition()) {
					toggleFixed(true);
					return;
				}
				toggleFixed(false);
			}, 60));

			cache.window.on('resize.' + nameSpace, debounce(function() {
				refreshStickAtPosition();
			}, 500));

			log('Scroll tracking enabled.');
		}

		function _process() {
			try{
			if ($(settings.contentNode).height() < 200) {
				log('Content node is not ready, retrying.');
				setTimeout(function() {
					_process();
				}, 500);
				return;
			}

			refreshCache();
			log('Processing wallpaper slot.');

			var container = getContainer(),
				slotIframe = cache.dfpSlot.find('iframe'),
				slotDiv = slotIframe.contents().find('#google_image_div,body').first(),
				slotLink = slotDiv.find('a:first'),
				slotImage = slotLink.find('img.img_ad:first,img:first').first(),
				slotBgColor = slotImage.prop('alt');

			log('Checking image.');
			if ( ! slotImage.length) {
				log('No image found in ad slot! Resetting.');
				_reset();
				return;
			}

			log('Getting background color.', slotBgColor);
			var bgColor = 'rgba(255,255,255,0)',
				bgColorCheck = slotBgColor.match(/(\#[A-Za-z0-9]+)/) || false;
			if (bgColorCheck && bgColorCheck.length > 1) {
				bgColor = bgColorCheck[1];
			}
			log('Using background color.', bgColor);

			_reset()
				.then(function() {
					log ('Building the new wallpaper.');

					var link = $('<a />')
						.prop({
							'href': slotLink.prop('href'),
							'target': slotLink.prop('target')
						});

					// If navThroughPlayer library is available, use it
					if (window._CMLS.navThroughPlayer) {
						window._CMLS.navThroughPlayer.updateLink(link, true);
					}

					// Build the iframe
					var iframe = $('<iframe />')
						.prop({
							'name': nameSpace + 'Iframe',
							'scrolling': 'no',
							'marginWidth': '0',
							'marginHeight': '0',
							'frameborder': '0'
						});

					log('Injecting iframe into container.');
					container = getContainer();
					container
						.css('backgroundColor', bgColor)
						.append(iframe);

					var iframeStyles = '<style>' +
						'html,body{background:transparent;margin:0;padding:0;width:100%;height:100%;}' +
						'body{background:url("' + slotImage.prop('src') +'") no-repeat top center;}' +
						'a{display:block;width:100%;height:100%;text-decoration:none;}' +
					'</style>';

					iframe
						.load(function() {
							iframe.contents().find('body')
								.append(iframeStyles, link);
						})
						.prop('src', 'about:blank');

					if (slotImage.length) {
						log('Initializing preloader.');
						$('<img />')
							.bind('load', function() {
								show();
								$(this).remove();
							})
							.prop('src', slotImage.prop('src'));
					} else {
						show();
					}
				});
			} catch(e) {
				console.log('WTF PEOPLE', e);
			}
		}
		this.process = _process;

		log('Initializing.');

		// Hook into ad render event to intercept new ads.
		function checkRenderEvent(e) {
			var pos = e.slot.getTargeting('pos');
			if (pos.indexOf('wallpaper-ad') > -1) {

				log('Caught render event for wallpaper-ad', e.slot.getSlotElementId());
				if (e.isEmpty) {

					log('Slot was empty, resetting wallpaper container.');
					return debounce(_reset, 1000);

				} else {

					log('Slot contained an ad, processing wallpaper.');
					return debounce(_process, 1000);

				}
				return false;
			}
		}
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push(function() {
			window.googletag.pubads().addEventListener('slotRenderEnded', checkRenderEvent);
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
				'transition: opacity 0.5s, height 0.6s, background-color 0.3s; top 0.1s;' +
				'opacity: 0;' +
			'}' +
			'.' + nameSpace + '-container iframe {' +
				'border: 0;' +
				'height: 100%;' +
				'width: 100%;' +
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

		// Process any wallpapers that exist at loadtime.
		if (window.document.readyState === 'complete' || window.document.readyState === 'loaded') {
			_process();
		} else {
			$(function() {
				_process();
			});
		}

		function _unbindAllListeners() {
			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];
			window.googletag.cmd.push(function() {
				window.googletag.pubads().removeEventListener('slotRenderEnded', checkRenderEvent);
			});
			$(window).off('.' +nameSpace);
		}
		this.unbindAllListeners = _unbindAllListeners;

	}

	settings.nameSpace = nameSpace;
	window._CMLS[nameSpace] = new WallpaperInjector(settings);

	// Hook into History events for Triton's player to kill myself.
	if (
		window._CMLS.whichPlayer().type === window._CMLS.const.PLAYER_TRITON &&
		window.History && window.History.Adapter
	) {
		window.History.Adapter.bind(window, 'statechange', function() {
			window._CMLS[nameSpace].reset();
			window._CMLS[nameSpace].unbindAllListeners();
			window._CMLS[nameSpace] = null;
		});
		window.History.Adapter.bind(window, 'pageChange', function() {
			window._CMLS[nameSpace] = new WallpaperInjector(settings);
		});
	}


}(jQuery, window));