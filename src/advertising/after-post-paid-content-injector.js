/**
 * After-post paid content injector
 *
 * Injects paid content code on any post using the standard post template.
 */
(function($, window, undefined){
	
	var scriptName = 'PAIDCONTENT INJECTOR',
		version = '0.4';

	function log() {
		if (window.top._CMLS && window.top._CMLS.logger) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	function winDef() {
		for (var i = arguments.length; i--;) {
			if (window[arguments[i]] || window.top[arguments[i]] || window.parent[arguments[i]]) {
				return true;
			}
		}
		return false;
	}

	if (winDef(
		'NO_ZERGNET',
		'NO_NEWSMAX',
		'NO_HINDSIGHT',
		'NO_PAIDCONTENT'
	)) {
		log('Opted out with window.NO_PAIDCONTENT, ejecting.');
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
	var postId = d.body.className.match(/postid\-(\d+)/i);
	if ( ! postId || postId.length < 2) {
		log('Could not determine main post ID.');
		return false;
	}
	postId = postId[1];

	var $main_article = $(
		'.wrapper-content article.post-' + postId
	);
	if ( ! $main_article.length) {
		log('Count not discover main page article.');
		return false;
	}

	var w = $main_article.width();
	if (w > 800 || w < 350) {
		log('Main article width is suspicious, ejecting.');
		return false;
	}

	// Find the parent column
	var $column = $main_article.parents('.column');
	if ( ! $column.length) {
		log('Could not determine main page article\'s parent column');
		return false;
	}

	log('Injecting content');

	// Create the injection point
	var injectpoint = d.createElement('div');
	injectpoint.id = "PAIDCONTENT-" + Math.ceil(Math.random()*6000000);
	injectpoint.setAttribute('style', 'position: relative !important; float: left !important; width: 100% !important');
	$column.append(injectpoint);

	// Zergnet code
	/*
	var zergnet = document.createElement('script');
	zergnet.type = 'text/javascript'; zergnet.async = true;
	zergnet.src = (document.location.protocol.toLowerCase() === "https:" ? "https:" : "http:") + '//www.zergnet.com/zerg.js?id=61785';
	var znscr = document.getElementsByTagName('script')[0];
	znscr.parentNode.insertBefore(zergnet, znscr);
	*/

	function createScript(scrUrl, attr) {
		var scr = document.createElement('script');
		scr.type = 'text/javascript';
		scr.async = true;
		scr.src = scrUrl;
		if (attr) {
			for (var a in attr) {
				scr.setAttribute(a, attr[a]);
			}
		}
		return scr;
	}

	function createIframe(attr, html) {
		var ifr = document.createElement('iframe');
		for(var a in attr) {
			ifr.setAttribute(a, attr[a]);
		}
		ifr.onload = function() {
			ifr.contentWindow.document.open();
			ifr.contentWindow.document.write(html);
			ifr.contentWindow.document.close();
			ifr.onload = false;
		};
		return ifr;
	}

	// Hindsight code
	// <script src="https://static.solutionshindsight.net/teju-webclient/teju-webclient.min.js"></script>
	// temporary test sites
	var hs_testsites = [
		"WMAL-FM",
		"KNBR-AF",
		"WBAP-AM",
		"WLAV-FM",
		"KSFO-AM",
		"KXXR-FM",
		"WJBC-AM",
		"WLS-AM1",
		"KABC-AM",
		"KRBE-FM",
		"KTCK-AM",
		"WJR-AM1",
		"WKQX-FM",
		"KGO-AM1",
		"KMJ-AF1",
		"KQRS-FM",
		"KSCS-FM",
		"WBWN-FM",
		"KPLX-FM",
		"WPRO-AM",
		"WBNQ-FM",
		"KSAN-FM",
		"WNTQ-FM",
		"WWTN-FM",
		"WQQK-FM",
		"WWWQ-FM",
		"KLIF-FM",
		"WFMS-FM",
		"WOKI-FM",
		"WGFX-FM",
	];
	if (
		window._ampconfig &&
		window._ampconfig.settings &&
		window._ampconfig.settings.syn_site_name &&
		hs_testsites.indexOf(window._ampconfig.settings.syn_site_name) > -1
	) {
		var hsurl = '//static.solutionshindsight.net/teju-webclient/teju-webclient.min.js';
		var hindsight = createScript(hsurl);
		injectpoint.appendChild(hindsight);
		log('Hindsight injected');
	}

	// Newsmax code
	var nmurl = '//static.newsmaxfeednetwork.com/web-clients/bootloaders/jtPvahXLC0BvyCYESN3Fgu/bootloader.js';
	if (window.matchMedia("only screen and (max-width: 760px)").matches) {
		nmurl = '//static.newsmaxfeednetwork.com/web-clients/bootloaders/Jx44GJqslQrQU3ZULtFwdD/bootloader.js';
	}
	var newsmax = createScript(
		nmurl,
		{
			'data-version': '3',
			'data-url': document.location.href,
			'data-zone': '[ZONE]',
			'data-display-within-iframe': 'true'
		}
	);
	injectpoint.appendChild(newsmax);
	log('Newsmax injected.');

}(jQuery, window.self));