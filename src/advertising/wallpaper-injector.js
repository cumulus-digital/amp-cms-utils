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
		version = '0.5';

	if (window._CMLS[nameSpace]) {
		//return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	function WallpaperInjector(settings) {
		var cache = {},
			processTimer,
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

		function checksum(s) {
			var hash = 0,
				strlen = s.length,
				i, c;
			if ( strlen === 0 ) {
				return hash;
			}
			for ( i = 0; i < strlen; i++ ) {
				c = s.charCodeAt( i );
				hash = ((hash << 5) - hash) + c;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash;
		}

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

		function getContainer(doNotBuild) {
			if (cache.container && cache.container.length) {
				return cache.container;
			}
			var existing = $('#' + nameSpace + 'Container');
			if (existing.length) {
				cache.container = existing;
				return cache.container;
			}
			if (doNotBuild === true) {
				return false;
			}
			log('Generating new wallpaper container.');
			refreshCache();
			var container = $('<div />', {
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
					injection: cache.injectionNode.css(['position', 'zIndex']),
					content: cache.contentNode.css(['position', 'zIndex']),
					footer: cache.footerNode.css(['position', 'zIndex'])
				};
			log('Checking positioning.', originalStyles);
			if (
				originalStyles.injection &&
				(
					originalStyles.injection.position === 'relative' ||
					originalStyles.injection.position === 'static'
				)
			) {
				log('Setting injection position to relative.');
				cache.injectionNode.css('position', 'relative');
			}
			if (originalStyles.content) {
				if (originalStyles.content.position === 'relative' || originalStyles.content.position === 'static') {
					log('Setting injection position to relative.');
					cache.contentNode.css('position', 'relative');
				}
				if (originalStyles.content.zIndex === 'auto' || originalStyles.content.zIndex <= container.css('zIndex')) {
					log('Raising content area above wallpaper container.');
					cache.contentNode.css('zIndex', container.css('zIndex') + 1);
				}
			}
			if (originalStyles.footer && originalStyles.footer.position === 'static') {
				log('Setting footer area position to relative.');
				cache.footerNode.css('position', 'relative');
				cache.footerNode.css('zIndex', container.css('zIndex') + 2);
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
			
			// Remove obstructiveNodes
			if (window.GPT_SITE_SLOTS) {
				cache.obstructiveNode.find('[id^="div-gpt-ad"]').each(function() {
					if (window.GPT_SITE_SLOTS.hasOwnProperty(this.id)) {
						window.googletag.destroySlots([window.GPT_SITE_SLOTS[this.id]]);
					}
				});
			}
			cache.obstructiveNode.remove();

			startTrackingScroll();
		}

		function _reset() {
			var deferred = $.Deferred(),
				container = getContainer(true),
				isOpen = (container && container.length) ? container.hasClass(nameSpace + '-open') : false,
				transitionFired = false;

			function finishRemoval() {
				transitionFired = true;

				cache.obstructiveNode.show();
				log('Clearing all event listeners.');
				cache.window.off('.' + nameSpace);

				if (container && container.length) {
					log('Removing wallpaper container.');
					container.off('.' + nameSpace).remove();
				}
				cache.container = null;

				deferred.resolve();
			}

			log('RESET!');

			if (container && container.length) {
				container
					.off(transitionEvent)
					.removeData()
					.removeProp('data')
					.css('backgroundColor', 'rgba(0,0,0,0)')
					.removeClass(nameSpace + '-open')
					.removeClass(nameSpace + '-fixed');

				log('Container is closing.');

				if (transitionEvent && isOpen) {
					container.on(transitionEvent, function(e) {
						// Assume opacity takes longest
						if (e.originalEvent.propertyName === 'opacity') {
							log('Transition complete.');
							finishRemoval();
						}
					});
				}
				setTimeout(function() {
					if ( ! transitionFired) {
						finishRemoval();
					}
				}, 800);
			} else {
				finishRemoval();
			}

			log('Returning our promise.');
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
			}, 50));

			cache.window.on('resize.' + nameSpace, debounce(function() {
				refreshStickAtPosition();
			}, 500));

			log('Scroll tracking enabled.');
		}

		function _process() {
			try{
				if ($(settings.contentNode).height() < 200) {
					if (processTimer === undefined) {
						processTimer = 20;
					}
					if (processTimer === 0) {
						log('Timed out waiting for content node.');
						processTimer = undefined;
						return;
					}
					processTimer--;
					log('Content node is not ready, retrying.', processTimer);
					setTimeout(function() {
						_process();
					}, 500);
					return;
				}

				refreshCache();
				log('Processing wallpaper slot.');

				var slotIframe = cache.dfpSlot.find('iframe'),
					slotDiv = slotIframe.contents().find('#google_image_div,body').first(),
					slotLink = slotDiv.find('a:first'),
					slotImage = slotDiv.find('img.img_ad:first,img:first').first(),
					slotBgColor = slotImage.prop('alt');

				log('Checking image.');
				if ( ! slotImage.length) {
					log('No image found in ad slot! Resetting.');
					_reset();
					return;
				}

				var container = getContainer();

				// We get a simple "hash" of the image url and link so we don't try to
				// replace the same background twice
				var hash = checksum((slotLink.length ? slotLink.prop('href') + slotLink.prop('target') : '') + slotImage.prop('src'));
				log('Generated hash.', hash);

				if (hash === container.data('hash')) {
					log('Requested wallpaper is already set.');
					return;
				}


				log('Getting background color.', slotBgColor);
				var bgColor = 'rgba(0,0,0,0)',
					bgColorCheck = slotBgColor.match(/(\#[A-Za-z0-9]+)/) || false;
				if (bgColorCheck && bgColorCheck.length > 1) {
					bgColor = bgColorCheck[1];
				} else {

					var xhr = new XMLHttpRequest();
					xhr.onload = function() {

						var reader = new FileReader();
						reader.onloadend = function() {

							var dataURI = reader.result;
							if (dataURI) {
								log('Got data URI for image', dataURI);
								var image = new window.Image();
								image.onload = function() {

									var canvas = window.document.createElement('canvas'),
										context = canvas.getContext('2d'),
										iW = image.naturalWidth ||
											image.offsetWidth ||
											image.width,
										iH = image.naturalHeight ||
											image.offsetHeight ||
											image.height,
										centerPoint = {
											x: iW/2,
											y: iH/2
										};

									canvas.width = iW;
									canvas.height = iH;

									context.drawImage(image, 0, 0);

									log('Getting color data for center point', centerPoint);
									var colorData = context.getImageData(
										centerPoint.x,
										centerPoint.y,
										centerPoint.x+1,
										centerPoint.y+1
									);

									if (colorData && colorData.data) {
										log('Got new color data!', colorData, canvas);
										var newColor = [
											colorData.data[0],
											colorData.data[1],
											colorData.data[2],
											colorData.data[3]
										];
										bgColor = 'rgba(' + newColor.join(',') + ')';
										log('Got updated background color!', bgColor);
										$('#' + nameSpace + 'Container').css('backgroundColor', bgColor);
									}

								};
								image.src = dataURI;

							}

						};
						reader.readAsDataURL(xhr.response);

					};
					xhr.open('GET', slotImage.prop('src'));
					xhr.responseType = 'blob';
					xhr.send();

				}
				log('Using background color.', bgColor);

				_reset()
					.then(function() {
						log ('Building the new wallpaper.');

						var link = '';
						if (slotLink.length) {
							link = $('<a />', {
									'href': slotLink.prop('href'),
									'target': slotLink.prop('target')
								});

							// If navThroughPlayer library is available, use it
							if (window._CMLS.navThroughPlayer) {
								window._CMLS.navThroughPlayer.updateLink(link[0]);
							}
						}

						// Build the iframe
						var iframe = $('<iframe />', {
								'name': nameSpace + 'Iframe',
								'scrolling': 'no',
								'marginWidth': '0',
								'marginHeight': '0',
								'frameborder': '0'
							});

						log('Injecting iframe into container.');
						container = getContainer();
						container
							.data('hash', hash)
							.css('backgroundColor', bgColor)
							.append(iframe);

						var iframeStyles = '<style>' +
							'html,body{background:transparent;margin:0;padding:0;width:100%;height:100%;}' +
							'body{background:url("' + slotImage.prop('src') +'") no-repeat top center;}' +
							(slotImage.prop('alt').indexOf('contain') > -1 ? 'body{background-size:100%}' : '') +
							'a{display:block;width:100%;height:100%;text-decoration:none;}' +
						'</style>';

						iframe
							.load(function() {
								log('Injecting wallpaper into iframe.');
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
				log('Unknown error!', e);
			}
		}
		this.process = _process;

		// Hook into ad render event to intercept new ads.
		function checkRenderEvent(e) {
			var pos = e.slot.getTargeting('pos');
			if (pos.indexOf('wallpaper-ad') > -1) {

				log('Caught render event for wallpaper-ad', e.slot.getSlotElementId());
				if (e.isEmpty) {

					log('Slot was empty, resetting wallpaper container.');
					_reset();

				} else {

					log('Slot contained an ad, processing wallpaper.');
					_process();

				}
				return false;
			}
		}

		function _unbindAllListeners() {
			$(window).off('.' +nameSpace);
		}
		this.unbindAllListeners = _unbindAllListeners;

		/*-------------------------------------------------*/
		log('Initializing.');

		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push(function() {
			window.googletag.pubads().addEventListener('slotRenderEnded', function(e) {
				debounce(checkRenderEvent(e), 1000);
			});
		});

		var styleSheet = '<style id="' + nameSpace + 'Styles">' +
			'.' + nameSpace + '-container {' +
				'display: block !important;' +
				'position: absolute;' +
				'z-index: 0;' +
				'top: 0;' +
				'left: 50%;' +
				'height: 0 !important;' +
				'width: 100vw !important;' +
				'overflow: hidden;' +
				'text-align: center;' +
				'transition: opacity 0.5s, height 0.6s, background-color 0.4s;' +
				'opacity: 0;' +
				'transform: translateX(-50%);' +
			'}' +
			'.' + nameSpace + '-container iframe {' +
				'border: 0;' +
				'height: 100%;' +
				'width: 100%;' +
			'}' +
			'.' + nameSpace + '-container ~ .grid-container {' +
				'transition: box-shadow 0.6s' +
			'}' +
			'.' + nameSpace + '-open {' +
				'height: 100% !important;' +
				'opacity: 1;' +
			'}' +
			'.' + nameSpace + '-open ~ .grid-container {' +
				'box-shadow: 0 0 20px rgba(0,0,0,0.3);' +
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

	}

	settings.nameSpace = nameSpace;
	window._CMLS[nameSpace] = new WallpaperInjector(settings);

}(jQuery, window));