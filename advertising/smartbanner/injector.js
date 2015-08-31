(function($, window, undefined) {

	var settings = {
		appWidgetSelector: '.free-apps,.mobile-apps',
		headerSelector: '.wrapper-header',
		logoSelector: 'figure.logo img',

		styleSheetUrl: 'https://cdn.rawgit.com/cumulus-digital/amp-cms-utils/commits/a0b1e63ff6e90594d73b204dd1e01b1f282cc592/advertising/smartbanner/smartbanner.css',
		libraryUrl: 'https://cdn.rawgit.com/cumulus-digital/amp-cms-utils/a0b1e63ff6e90594d73b204dd1e01b1f282cc592/advertising/smartbanner/smartbanner.js'
	};
	
	var v = '0.8';

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			console.log('[SMART APP BANNER INJECTOR ' + v + ']', [].slice.call(arguments));
		}
	}

	// Only execute once
	window._CMLS = window._CMLS || {};
	if (window._CMLS.smartBannerEnabled2 && window._CMLS.smartBannerEnabled2 === true) {
		log('Already enabled, skipping.');
		return;
	}

	/**
	 * Locates and returns app store IDs from supplied app widget object
	 * @param  {object} appWidget jQuery object for app widget
	 * @return {object}           discovered IDs for ios and android
	 */
	function getAppIds(appWidget) {
		var returnLinks = {};
		var links = {
			ios: appWidget.find('a[href*="itunes.apple.com/us/app"]:first'),
			android: appWidget.find('a[href*="play.google.com/store"]:first')
		};
		if (links.ios && links.ios.length > 0) {
			var iOSId = links.ios.attr('href').match(/id(\d+)/i);
			if (iOSId && iOSId.length) {
				returnLinks.ios = iOSId[1];
			}
		}
		if (links.android && links.android.length) {
			var androidId = links.android.attr('href').match(/id=([0-9a-zA-Z\.]+)/i);
			if (androidId && androidId.length) {
				returnLinks.android = androidId[1];
			}
		}
		return returnLinks;
	}

	/**
	 * Generated meta tag strings from supplied app ID object
	 * @param  {object} appIds android and ios app ID strings
	 * @return {array}         array of meta tag strings
	 */
	function createMetaTags(appIds) {
		log('Generating meta tags');
		var metaTags = [];
		function toArray(obj) {
			return obj === null ? [] : (Array.isArray(obj) ? obj : [obj]);
		}
		function generateiOSMeta(id) {
			return '<meta name="apple-itunes-app" content="app-id=' + id + '">';
		}
		function generateAndroidMeta(id) {
			return '<meta name="google-play-app" content="app-id=' + id + '">';
		}
		if (appIds.ios) {
			metaTags = metaTags.concat(toArray(appIds.ios).map(generateiOSMeta));
		}
		if (appIds.android) {
			metaTags = metaTags.concat(toArray(appIds.android).map(generateAndroidMeta));
		}
		return metaTags;
	}

	/**
	 * Attempts to craft a nice looking title from the supplied page title,
	 * stripping extraneous bits.
	 * @param  {string} title original page title
	 * @return {string}       normalized title
	 */
	function createNiceTitle(title) {
		var normalizedTitle = title.replace(/(\|\s*)?Cumulus(\|\s*)?/, '').match(/\|\s*([^\|]*)(\|.*)?$/);
		if (normalizedTitle && normalizedTitle.length) {
			log('Using normalized title', normalizedTitle);
			return normalizedTitle[1];
		}
		return title;
	}

	/**
	 * Generates app icon link strings from the site logo
	 * @param  {string} logoSelector CSS selector for site logo
	 * @return {array|null}	         array of link strings or null if no logo is found
	 */
	function createIconLinks(logoSelector) {
		var logoUrl = $(logoSelector).attr('src');
		if (logoUrl && logoUrl.length) {
			log('Generating icon link tags');
			return [
				'<link rel="apple-touch-icon" href="' + logoUrl + '">',
				'<link rel="android-touch-icon" href="' + logoUrl + '">'
			];
		}
		return null;
	}

	/**
	 * Attempts to get the background color of the site masthead
	 * @param  {string} selector CSS selector for site masthead
	 * @return {string}          CSS color value
	 */
	function getHeaderBackgroundColor(selector) {
		var color = $(selector).css('backgroundColor');
		if (color && color.length) return color;
		return 'rgba(0,0,0,0.5)';
	}

	/**
	 * Appends a supplied array or string to the doc head
	 * @param  {object|array|string} arr   elements to append
	 */
	function appendToHead(arr) {
		$('head').append(arr);
	}

	function injectSmartBanner() {
		if ( ! window._CMLS.smartBanner) {
			setTimeout(injectSmartBanner, 300);
			return;
		}

		var appWidget = $(settings.appWidgetSelector);
		if ( ! appWidget || appWidget.length < 1) {
			log('No app widget found, aborting.');
			return;
		}

		log('Injecting');

		var pageTitle = document.title,
			iconUrl,
			iconBackground = getHeaderBackgroundColor(settings.headerSelector),
			gotLinks = false,
			headAppend = [];

		var metaTags = createMetaTags(getAppIds(appWidget));
		if ( ! metaTags || ! metaTags.length) {
			log('No app IDs found, aborting.');
		}
		headAppend = headAppend.concat(metaTags);

		if ( ! $('head link[rel="apple-touch-icon"]').length) {
			headAppend = headAppend.concat(createIconLinks(settings.logoSelector));
		}

		pageTitle = createNiceTitle(pageTitle);

		// Add styles
		headAppend.push(
			'<link rel="stylesheet" href="' + settings.styleSheetUrl + '" type="text/css">'
		);

		appendToHead(headAppend);

		window._CMLS.smartBanner({
			title: pageTitle,
			author: 'Cumulus',
			button: 'VIEW'
		});

		log('Injected');
		window._CMLS.smartBannerEnabled = true;

	}

	$(function() {
		if ( ! window._CMLS.smartBanner) {
			log('Loading SmartBanner library.');
			$.getScript(settings.libraryUrl, injectSmartBanner);
			return;
		}
		injectSmartBanner();
	});

}(jQuery, window));