/**
 * Injects wallpaper ads
 */
;(function($, window, undefined){
	
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

	/*---------------------------------------------------------------*/

	var scriptName = 'WALLPAPER INJECTOR',
		nameSpace = 'wallpaperInjector',
		version = '0.6',
		_CMLS = window._CMLS;

	if (_CMLS[nameSpace]) {
		return;
	}

	function log() {
		_CMLS.log(scriptName + ' v' + version, arguments);
	}

	function WallpaperInjector(settings) {

		log('Initializing.');

		var cache = {},
			throttle = _CMLS.throttle,
			debounce = _CMLS.debounce,
			css = '<style id="%%NAMESPACE%%Styles">' +
				'.%NAMESPACE%-container {' +
					'display: block;' +
					'position: absolute;' +
					'z-index: 0;' +
					'top: 0;' +
					'left: 0;' +
					'height: 0;' +
					'width: 100%;' +
					'overflow: hidden;' +
					'text-align: center;' +
					'transition: opacity 0.5s, height 0.6s, background-color 0.4s;' +
					'opacity: 0;' +
				'}' +
				'.%NAMESPACE%-container iframe {' +
					'border: 0;' +
					'height: 100%;' +
					'width: 100%;' +
				'}' +
				'.%NAMESPACE%-container ~ .grid-container {' +
					'transition: box-shadow 0.6s' +
				'}' +
				'.%NAMESPACE%-open {' +
					'height: 100%;' +
					'opacity: 1;' +
				'}' +
				'.%NAMESPACE%-open ~ .grid-container {' +
					'box-shadow: 0 0 20px rgba(0,0,0,0.3);' +
				'}' +
				'.%NAMESPACE%-fixed {' +
					'position: fixed;' +
				'}' + 
				'.%NAMESPACE%-raiser {' +
					'position: relative !important;' +
					'z-index: 5 !important;' +
				'}' +
				'%DFPSLOTNODE% {' +
					'display: none;' +
				'}' +
			'</style>'.replace(/%NAMESPACE%/g, nameSpace).replace(/%DFPSLOTNODE%/g, settings.dfpSlotNode);

		$(css).appendTo('head');

		/**
		 * Refresh cache of jQuery objects
		 * @return {Object} Cache collection
		 */
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

		/**
		 * Return or generate the wallpaper container.
		 * @param  {Boolean} DoNotBuild If true, don't build a new container
		 * @return {jQuery}             Cached jQuery object for container
		 */
		function getWallpaperContainer(DoNotBuild) {
			// If we've already got a container, use it
			if (cache.container && cache.container.length) {
				return cache.container;
			}

			// Try to find an existing container
			var existing = $('#' + nameSpace + 'Container');
			if (existing.length) {
				cache.container = existing;
				return cache.container;
			}

			// Attempt to build a new container unless told not to
			if (DoNotBuild === true) {
				return false;
			}
			
			log('Generating a new wallpaper container.');
			refreshCache();
			cache.container = $('<div />', {
				id: nameSpace + 'Container',
				class: nameSpace + '-container'
			}).prependTo(cache.injectionNode);

			raiseContentArea();
			return cache.container;
		}

		/**
		 * Raise content area and footer by applying raiser class
		 * @return {void}
		 */
		function raiseContentArea() {
			cache.contentNode.addClass(nameSpace + '-raiser');
			cache.footerNode.addClass(nameSpace + '-raiser');
		}

		/**
		 * Get the current position to stick the wallpaper at when it scrolls
		 * to this point.
		 * @return {Number} Pixel position
		 */
		function refreshStickAtPosition() {
			log('Refreshing sticky position.');
			cache.stickAt = cache.stickNode.length ? cache.stickNode.offset().top : 0;
			return cache.stickAt;
		}

		/**
		 * Check if wallpaper container is currently fixed position
		 * @return {Boolean}
		 */
		function isFixed() {
			var container = getWallpaperContainer();
			return container.hasClass(nameSpace + '-fixed');
		}

		/**
		 * Sets wallpaper container fixed or unfixed to stick position.
		 * @param  {Boolean} forceFix True to force sticking, false to force unsticking
		 * @return {void}
		 */
		function toggleFixed(forceFix) {
			var container = getWallpaperContainer(),
				fixed = isFixed();
			if (fixed || forceFix === false) {
				log('Unfixing wallpaper position.');
				container.css('top', '0')
					.removeClass(nameSpace + '-fixed');
			}
			if ( ! fixed || forceFix === true) {
				log('Fixing wallpaper position');
				refreshStickAtPosition();
				container.css('top', cache.stickAt)
					.addClass(nameSpace + '-fixed');
			}
		}

		function startTrackingScroll() {
			log('Initializing scroll tracking.');

			/**
			 * Determine if current scroll position has passed stick position
			 * @return {Boolean}
			 */
			function hasPassedStickPosition() {
				var scrollTop = cache.window.scrollTop(),
					offset = cache.injectionNode.length ? cache.injectionNode.offset().top : 0;
				refreshStickAtPosition();
				if (offset < scrollTop + cache.stickAt) {
					return true;
				}
				return false;
			}

			if (hasPassedStickPosition()) {
				toggleFixed(true);
			} else {
				toggleFixed(false);
			}

			cache.window.on('scroll.' + nameSpace, throttle(function(){
				if (hasPassedStickPosition()) {
					toggleFixed(true);
					return;
				}
				toggleFixed(false);
			}, 50));

			cache.window.on('resize.' + nameSpace, debounce(function(){
				refreshStickAtPosition();
			}, 500));

			log('Scroll tracking enabled.');
		}

		/**
		 * Show the wallpaper and init scroll tracking
		 * @return {void}
		 */
		function show() {
			log('Displaying wallpaper.');
			var container = getWallpaperContainer();
			container.addClass(nameSpace + '-open');
			cache.obstructiveNode.hide();
			startTrackingScroll();
		}

		/**
		 * Removes show classes from wallpaper container, removes all namespaced
		 * event listeners from window, and shows the obstructive nodes.
		 * @return {void}
		 */
		function resetWallpaper() {
			var deferred = $.Deferred(),
				container = getWallpaperContainer();

			cache.obstructiveNode.show(300);

			cache.window.off('.' + nameSpace);

			container
				.removeData()
				.removeProp('data')
				.css('backgroundColor', 'rgba(0,0,0,0)')
				.removeClass([nameSpace + '-open', nameSpace + '-fixed']);

			setTimeout(function(){
				deferred.resolve();
			}, 500);

			return deferred.promise();
		}

		/**
		 * Process a wallpaper request, building and injecting wallpaper to page
		 * @return {void}
		 */
		function processWallpaper() {
			if ($(settings.contentNode).height() < 200) {
				log('Content node is not yet ready, retrying...');
				setTimeout(function(){
					processWallpaper();
				}, 500);
				return;
			}

			refreshCache();
			log('Processing wallpaper request.');

				// Get ad iframe
			var slotIframe = cache.dfpSlot.find('iframe'),
				// Get container of ad content
				slotDiv = slotIframe.contents().find('#google_image_div,body').first(),
				// Get ad link
				slotLink = slotDiv.find('a:first'),
				// Get ad image
				slotImage = slotDiv.find('img.img_ad:first,img:first').first(),
				// Get requested background color from image alt attribute
				slotBgColor = slotImage.prop('alt');

			var container = getWallpaperContainer();
			if (
				slotLink.prop('href') === container.data('slotlink') &&
				slotImage.prop('src') === container.data('slotimage')
			) {
				log('Requested wallpaper is already set.');
				return;
			}

			log('Checking image.');
			if ( ! slotImage.length) {
				log('No image found in ad slot, resetting.');
				resetWallpaper();
				return;
			}

			// Double-check background color, pull it out of an otherwise busy string
			var bgColor = 'rgba(255,255,255,0)',
				bgColorCheck = slotBgColor.match(/((\#[A-Za-z0-9]+)|(rgba?\(.*\)))/) || false;
			if (bgColorCheck && bgColorCheck.length > 1) {
				bgColor = bgColorCheck[1];
			}
			log('Using background color.', bgColor);

			resetWallpaper()
				.then(function() {
					log('Building new wallpaper.');

					var link, iframe, styles,
						container = getWallpaperContainer();

					// Generate link if possible
					if (slotLink.length) {
						link = $('<a/>', {
							href: slotLink.prop('href'),
							target: slotLink.prop('target')
						});

						// If NavThroughPlayer library is available, update our link to use it
						if (_CMLS.navThroughPlayer) {
							_CMLS.navThroughPlayer.updateLink(link);
						}

						container.data('slotlink', slotLink.prop('href'));
					}

					// Start generating the iframe container
					iframe = $('<iframe />', {
						name: nameSpace + 'Iframe',
						scrolling: 'no',
						marginWidth: '0',
						marginHeight: '0',
						frameborder: '0',
						src: 'about:blank'
					});

					styles = '<style>' +
						'html, body { background: transparent; margin: 0; padding: 0; width: 100%; height: 100%; }' +
						'body { background: url("' + slotImage.prop('src') + '") no-repeat top center; }' +
						'a { display: block; width: 100%; height: 100%; text-decoration: none; }' +
					'</style>';

					iframe.load(function(){
						log('Injecting wallpaper into frame.');
						iframe.contents().find('body').append(styles,link);
					});

					log('Injecting iframe into container.');
					container.css('backgroundColor', bgColor).append(iframe);

					// Use a separate image object to load the image and
					// get the load event from that to show iframe
					if (slotImage.length) {
						$('<img/>').bind('load', function(){
							show();
							$(this).remove();
						}).prop('src', slotImage.prop('src'));
					} else {
						show();
					}
				});

		}

		// Hook into ad render event to intercept new ads.
		function checkRenderEvent(e) {
			var pos = e.slot.getTargeting('pos');
			if (pos.indexOf('wallpaper-ad') > -1) {

				log('Caught render event for wallpaper-ad', e.slot.getSlotElementId());
				if (e.isEmpty) {

					log('Slot was empty, resetting wallpaper container.');
					resetWallpaper();

				} else {

					log('Slot contained an ad, processing wallpaper.');
					processWallpaper();

				}
				return false;
			}
		}


		// Check for new wallpapers on slot render
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push(function(){
			window.googletag.pubads().addEventListener('slotRendereEnded', function(e){
				debounce(checkRenderEvent(e), 1000);
			});
		});

		// Process any wallpapers that exist at loadtime
		if (window.self.document.readyState === 'complete' || window.self.document.readyState === 'loaded') {
			processWallpaper();
		} else {
			window.document.addEventListener("DOMContentLoaded", function(){
				processWallpaper();
			});
		}

	}

	settings.nameSpace = nameSpace;
	_CMLS[nameSpace] = new WallpaperInjector();

}(jQuery, window));