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
		atscr.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55dc79597bae383e';
		atscr.async = true;
		window.document.body.appendChild(atscr);
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
			var addthisLayer = $('.atss-left');
			// Re-inject if the widget doesn't already exist on the page
			if ( ! addthisLayer.length) {
				injectAddthis();
			}
			log('Resetting.');
			window.addthis.layers.refresh();
			addthisLayer.removeClass('slideOutLeft');
		}
	}

	// Hide addthis initially on navigation
	$(window).on('statechange', function() {
		$('.atss-left').addClass('slideOutLeft');
	});

	// For sites with Triton player, reset addthis on navigation
	$(window).on('pageChange', function() {
		resetAddthis();
	});
	
	if ( ! isHomepage()) {
		injectAddthis();
	}
}(jQuery, window.self));