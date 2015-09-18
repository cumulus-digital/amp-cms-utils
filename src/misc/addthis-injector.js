/**
 * Loads AddThis and handles pJAX reinitialization
 */
(function ($, window, undefined) {

	var version = '0.2';

	// Don't overwrite existing addthis functions
	if (window.addthis) {
		return;
	}

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			var ts = (new Date());
			ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
			console.log('[ADDTHIS INJECTOR ' + version + ']', ts, [].slice.call(arguments));
		}
	}

	function injectAddthis() {
		log('Injecting.');
		var atscr = window.document.createElement('script');
		atscr.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55dc79597bae383e&async=1';
		atscr.async = true;
		window.document.body.appendChild(atscr);
		window.loadAddThis = function() {
			window.addthis.init();
			window.addthis.toolbox();
			window.addthis.layers.refresh();
			window.addthis_share = window.addthis_share || {};
			window.addthis_share.url = window.location.href;
			window.addthis_share.title = window.document.title;
		};
	}

	// Check if we're using TuneGenie's player
	if (window.tgmp) {
		if (window === window.top) {
			log('Using TuneGenie player and injected in top window, ejecting.');
			return;
		}
		// Inject every time.
		injectAddthis();
		return;
	}

	// Check if we're on the homepage
	function isHomepage() {
		return window.location.pathname === '/' && /[\?&]?p=/i.test(window.location.search) === false;
	}

	function resetAddthis() {
		if (window.addthis) {
			var addthisLayer = $('.atss-left'),
				transitions = $('html.csstransitions').length;
			// Re-inject if the widget doesn't already exist on the page
			if ( ! addthisLayer.length) {
				window.addthis = null;
				window._adr = null;
				window._atc = null;
				window._atd = null;
				window._ate = null;
				window._atw = null;
				window.addthis_share = {};
				$('.addthis-smartlayers,.addthis-toolbox,#_atssh').remove();
			}
			log('Resetting.');
			window.addthis.layers.refresh();
			var newClass = transitions ? 'slideOutLeft' : 'at4-hide';
			if ( ! isHomepage()) {
				addthisLayer.removeClass(newClass);
			} else {
				addthisLayer.addClass(newClass);
			}
		}
	}

	// Hide addthis initially on navigation
	$(window).on('statechange', function() {
		var addthisLayer = $('.atss-left'),
			transitions = $('html.csstransitions').length;
		if ( ! addthisLayer.length) {
			window.addthis = null;
			window._adr = null;
			window._atc = null;
			window._atd = null;
			window._ate = null;
			window._atw = null;
			window.addthis_share = {};
			$('.addthis-smartlayers,.addthis-toolbox,#_atssh').remove();
			injectAddthis();
		}
		if (transitions) {
			addthisLayer.addClass('slideOutLeft');
		} else {
			addthisLayer.addClass('at4-hide');
		}
	});

	// For sites with Triton player, reset addthis on navigation
	$(window).on('pageChange', function() {
		resetAddthis();
	});
	
	if ( ! isHomepage()) {
		injectAddthis();
	}
}(jQuery, window.self));