/**
 * Zergnet injector
 *
 * Injects Zergnet code on any post using the standard post template.
 */
(function($, window, undefined){
	
	var scriptName = 'ZERGNET INJECTOR',
		//nameSpace = 'zergnetInjector',
		version = '0.2';

	function log() {
		if (window.top._CMLS && window.top._CMLS.logger) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	if (window.top.NO_ZERGNET || window.parent.NO_ZERGNET || window.NO_ZERGNET) {
		log('Opted out with window.NO_ZERGNET, ejecting.');
		return false;
	}

	var d = window.document;

	// Make sure we're in the right layout
	if (
		// Must be a single post
		d.body.className.indexOf(' single ') < 0 ||
		// Must not use the full page layout
		d.body.className.indexOf('layout-using-template-1') > -1
	) {
		log('Not a single post layout');
		return false;
	}

	// Find the main page article
	var main_article = d.querySelector(
		'.wrapper-content > .grid-container > .row-1 > .column-1 > .block-type-content > .block-content > .loop > article.post.format-standard,' +
		'.wrapper-content > .grid-container > .row-1 > .column-1 > .block-type-content > .block-content > .loop > article.feed_post,' +
		'.wrapper-content > .grid-container > .row-1 > .column-1 > .block-type-content > .block-content > .loop > article.feed_posts'
	);
	if ( ! main_article) {
		log('Could not discover main page article.');
		return false;
	}

	// Check any special conditions on the main page article
	if (main_article.getBoundingClientRect().width > 800) {
		log('Found main page article, but it\'s suspiciously wide so we think it is not a normal post.');
		return false;
	}

	log('Injecting Zergnet');

	// Create the injection point
	var injectpoint = d.createElement('div');
	injectpoint.id = "zergnet-widget-61785";
	main_article.parentNode.insertBefore(injectpoint, main_article.nextSibling);

	// Zergnet code
	var zergnet = document.createElement('script');
	zergnet.type = 'text/javascript'; zergnet.async = true;
	zergnet.src = (document.location.protocol.toLowerCase() === "https:" ? "https:" : "http:") + '//www.zergnet.com/zerg.js?id=61785';
	var znscr = document.getElementsByTagName('script')[0];
	znscr.parentNode.insertBefore(zergnet, znscr);

}(jQuery, window.self));