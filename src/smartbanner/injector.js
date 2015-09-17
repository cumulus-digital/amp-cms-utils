(function(window, undefined) {
	var v = '0.11',
		settings = {
			title: window.document.title,
			author: 'Cumulus',
			backgroundColor: 'transparent',

			appWidgetSelector: '.free-apps,.mobile-apps',
			headerSelector: '.wrapper-header',
			logoSelector: 'figure.logo img',

			styleSheetUrl: 'https://cdn.rawgit.com/cumulus-digital/amp-cms-utils/3f5b5d858347dd35e7a8ecb47ccbbca614e012c0/advertising/smartbanner/smartbanner.css',
			libraryUrl: 'https://cdn.rawgit.com/cumulus-digital/amp-cms-utils/3f5b5d858347dd35e7a8ecb47ccbbca614e012c0/advertising/smartbanner/smartbanner.js'
		};

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			console.log('[SMART APP BANNER INJECTOR ' + v + ']', [].slice.call(arguments));
		}
	}

	// Only inject once
	window._CMLS = window._CMLS || {};
	if (window._CMLS.smartBannerEnabled) {
		log('Already enabled, skipping.');
		return;
	}

	var injector = {

		/**
		 * Fetch app IDs from supplied app widget node
		 * @param  {NodeList}     appWidget  Node to search within
		 * @return {object|null}             IDs discovered
		 */
		getAppIds: function(appWidget) {
			var ids = {};
			var links = {
				apple: appWidget.querySelector('a[href*="itunes.apple.com/us/app"]'),
				google: appWidget.querySelector('a[href*="play.google.com/store/apps"]')
			};
			if (links.apple) {
				var appleId = links.apple.getAttribute('href').match(/id(\d+)/i);
				if (appleId && appleId.length) {
					ids.apple = appleId[1];
				}
			}
			if (links.google) {
				var googleId = links.google.getAttribute('href').match(/id=([0-9A-Za-z\.]+)/i);
				if (googleId && googleId.length) {
					ids.google = googleId[1];
				}
			}
			if (links.apple || links.google) {
				log('Discovered app IDs', ids);
				return ids;
			}
			return null;
		},

		/**
		 * Generate meta tags from supplied app ID object
		 * @param  {Object}     ids  apple and google ID strings
		 * @return {Array|null}      array of meta tag elements
		 */
		createMetaTags: function(ids) {
			log('Generating meta tags');
			var tags = [];
			var names = {
				apple: 'apple-itunes-app',
				google: 'google-play-app'
			};
			var meta;
			for(var i in ids) {
				if (names[i]) {
					meta = window.document.createElement('meta');
					meta.setAttribute('name', names[i]);
					meta.setAttribute('content', 'app-id=' + ids[i]);
					tags.push(meta);
				}
			}
			if (tags.length) {
				log('Generated meta tags', tags);
				return tags;
			}
			return null;
		},

		/**
		 * Generate a sane title from supplied string
		 * @param  {string} title original title
		 * @return {string}       sane title
		 */
		createNiceTitle: function(title) {
			var normalizedTitle = title.replace(/(\|\s*)?Cumulus(\|\s*)?/, '').match(/\|\s*([^\|]*)(\|.*)?$/);
			if (normalizedTitle && normalizedTitle.length) {
				log('Using nice title', normalizedTitle[1]);
				return normalizedTitle[1];
			}
			return title;
		},

		/**
		 * Generate app icon links from a supplied image
		 * @param  {Image}      logo image to use
		 * @return {array|null}      link elements
		 */
		createIconLinks: function(logo) {
			if ( ! logo) {
				return null;
			}
			var src = logo.getAttribute('src');
			if (src) {
				log('Generating link tags with logo image url', src);
				var appleLink = window.document.createElement('link');
					appleLink.setAttribute('rel', 'apple-touch-icon');
					appleLink.setAttribute('href', src);
				var googleLink = window.document.createElement('link');
					appleLink.setAttribute('rel', 'android-touch-icon');
					appleLink.setAttribute('href', src);
				return [
					appleLink, googleLink
				];
			}
			return null;
		},

		/**
		 * Attempts to get the background color of a supplied node
		 * @param  {Object} node
		 * @return {string}      Background color
		 */
		getBackgroundColor: function(node) {
			var color = getComputedStyle(node, null).getPropertyValue('background-color');
			log('Getting background color', color);
			if (color) {
				log('Got background color', color);
				return color;
			}
			return 'transparent';
		},

		appendToHead: function(arr) {
			log('Injecting support nodes into head.', arr);
			var head = window.document.querySelector('head');
			for(var i = 0; i < arr.length; i++) {
				head.appendChild(arr[i]);
			}
		},

		init: function() {
			var appWidget = window.document.querySelector(settings.appWidgetSelector);
			if ( ! appWidget) {
				log ('No app widget found, ejecting.');
				return false;
			}

			var headAppend = [],
				title = this.createNiceTitle(window.document.title),
				logo = window.document.querySelector(settings.logoSelector),
				background = this.getBackgroundColor(window.document.querySelector(settings.headerSelector));

			var metaTags = this.createMetaTags(this.getAppIds(appWidget));
			if ( ! metaTags || ! metaTags.length) {
				log('No app IDs found, ejecting.');
				return false;
			}
			headAppend = headAppend.concat(metaTags);

			var iconLinks = this.createIconLinks(logo);
			headAppend = headAppend.concat(iconLinks);

			var styles = window.document.createElement('link');
				styles.setAttribute('rel', 'stylesheet');
				styles.setAttribute('href', settings.styleSheetUrl);
			headAppend.push(styles);

			if ( ! window._CMLS.smartBanner) {
				var library = window.document.createElement('script');
					library.src = settings.libraryUrl;
				headAppend.push(library);
			}

			this.appendToHead(headAppend);

			settings.title = title;
			settings.backgroundColor = background;

			return true;
		}

	};

	function injectBanner() {
		if ( ! window._CMLS.smartBanner) {
			setTimeout(injectBanner, 300);
			return;
		}
		log('Injecting', settings);
		window._CMLS.smartBanner({
			icon: {
				color: settings.backgroundColor
			},
			title: settings.title,
			author: settings.author,
			button: 'View'
		});
	}

	var domReady = function(callback) {
		if (document.readyState === "interactive" || document.readyState === "complete") {
			callback();
		} else {
			document.addEventListener("DOMContentLoaded", callback);
		}
	};

	domReady(function() {
		log('Initializing.');
		var injectable = injector.init();
		if (injectable) {
			injectBanner();
		}
	});

	log('Loaded.');

}(window));