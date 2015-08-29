/**
 * Loads AddThis and handles pJAX reinitialization
 */
(function ($, window, undefined) {
	window.addthis_config = { 'data_track_addressbar' : false, 'pubid': 'ra-55dc79597bae383e' };
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
	if (window.addthis) clearAddThis();
	
	// Do not load on homepage
	if (window.location.pathname == '/') return;
	
	// If a click ever brings us to the homepage, get rid of AddThis.
	$(window).click(function() {
		setTimeout(function() {
			if (window.location.pathname == '/') clearAddThis();
		}, 300);
	});

	$.getScript('//s7.addthis.com/js/300/addthis_widget.js#async=1')
		.done(function() {
			addthis.init();
			addthis.toolbox();
		});
	window.loadAddThis = function() {
		addthis.init();
		addthis.toolbox();
	};
}(jQuery, window));