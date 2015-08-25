/**
 * Smart App Banner Fakery!
 * Injects a fake smart app banner using information from the
 * free apps widget on Cumulus AMP CMS sites.
 */
(function ($, window, undefined) {

	var v = '0.7';

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			console.log('[SMART APP BANNER ' + v + ']', [].slice.call(arguments));
		}
	}

	// Only execute once.
	window._CMLS = window._CMLS || {};
	window._CMLS.smartBannerEnabled = window._CMLS.smartBannerEnabled || false;
	if (window._CMLS.smartBannerEnabled === true) {
		log('Already enabled, skipping.');
		return;
	}

	function injectSmartBanner() {
		// Wait for smartbanner to be available
		if ( ! $.smartbanner) {
			setTimeout(injectSmartBanner, 200);
			return;
		}

		log('Initializing.');

		var page_title = document.title,
			icon_url,
			icon_background = 'rgba(0,0,0.5)',
			app_widget_selector = '.free-apps',
			app_widget = $(app_widget_selector),
			got_links = false,
			head_append = [];

		if ( ! app_widget.length) {
			log('No app widget found, skipping');
			return;
		}

		// Get app IDs and inject meta tags
		var links = {
			ios: app_widget.find('a[href*="itunes.apple.com/us/app"]:first'),
			android: app_widget.find('a[href*="play.google.com/store"]:first')
		};
		if (links.ios.length) {
			var ios_id = links.ios.attr('href').match(/id(\d+)/i);
			if (ios_id && ios_id.length) {
				head_append.push(
					'<meta name="apple-itunes-app" content="app-id=' + ios_id[1] + '">'
				);
				got_links = true;
			}
		}
		if (links.android.length) {
			var android_id = links.android.attr('href').match(/id=([0-9a-zA-Z\.]+)/i);
			if (android_id && android_id.length) {
				head_append.push(
					'<meta name="google-play-app" content="app-id=' + android_id[1] + '">'
					);
				got_links = true;
			}
		}

		// Eject early if we didn't find any links
		if ( ! got_links) {
			log('No app links found in app widget, skipping.');
			return;
		}

		// Craft a reasonable page title
		var normalized_page_title = page_title.replace(/(\|\s*)?Cumulus(\|\s*)?/, '').match(/\|\s*([^\|]*)(\|.*)?$/);
		if (normalized_page_title && normalized_page_title.length) {
			page_title = normalized_page_title[1];
		}

		// Generate app icon from site logo
		var logo_url = $('figure.logo img').attr('src');
		if (logo_url.length && ! $('head link[rel="apple-touch-icon"]').length) {
			head_append.push(
				'<link rel="apple-touch-icon" href="' + logo_url + '">',
				'<link rel="android-touch-icon" href="' + logo_url + '">'
			);
		}

		// Attempt to discover header background color
		var header_background = $('.wrapper-header').css('background-color');
		if (header_background && header_background.length) {
			icon_background = header_background;
		}

		// Add smartbanner library styles
		head_append.push(
			'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.smartbanner/1.0.0/jquery.smartbanner.min.css" type="text/css">',
			'<style>#smartbanner .sb-icon { background-color: ' + icon_background + ' !important; background-size: contain !important; background-repeat: no-repeat !important; background-position: center center !important; } #smartbanner.android .sb-close { top: 10px; } #smartbanner.android .sb-icon { top: 15px; } #smartbanner.android .sb-info { top: 20px; } #smartbanner.android .sb-button { top: 28px; min-height: 24px; }</style>'
		);

		// Inject all our header stuff
		$('head').append(head_append);

		var force_it = navigator.userAgent.match(/iPad|iPhone|iPod/g) ? 'ios' : null;

		$.smartbanner({
			title: page_title,
			iconGloss: false,
			author: 'Cumulus',
			button: 'VIEW',
			force: force_it
		});

		log('Injected!');
		window._CMLS.smartBannerEnabled = true;
	}

	$(function() {
		if ( ! $.smartbanner) {
			log('Loading SmartBanner library.');
			$.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.smartbanner/1.0.0/jquery.smartbanner.min.js', injectSmartBanner);
			return;
		}
		injectSmartBanner();
	});
}(jQuery, window));