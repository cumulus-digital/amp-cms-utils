/**
 * Loads AddThis and handles pJAX reinitialization
 */
/* globals addthis */
(function ($, window, undefined) {
	function clearAddThis() {
		window.addthis = null;
		window._adr = null;
		window._atc = null;
		window._atd = null;
		window._ate = null;
		window._atr = null;
		window._atw = null;
		window.addthis_share = window.addthis_share||{};
		window.addthis_share.url = window.location.href;
		window.addthis_share.title = window.document.title;
		$('.addthis-smartlayers,.addthis-toolbox,#_atssh').remove();
	}
	if (window.addthis) {
		clearAddThis();
	}
	
	function isHomepage() {
		return window.location.pathname === '/' && /[\?&]?p=/i.test(window.location.search) === false;
	}

	// Do not load on homepage
	if (isHomepage()) {
		return;
	}

	// For sites with the player, we'll explicitly kill addthis on navigation to the homepage
	$(window).on('statechange', function() {
		if (isHomepage()) {
			clearAddThis();
		}
	});
	
	var atscr = window.document.createElement('script');
	atscr.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55dc79597bae383e&async=1';
	window.document.body.appendChild(atscr);
	window.loadAddThis = function() {
		addthis.init();
		addthis.toolbox();
	};
}(jQuery, window));