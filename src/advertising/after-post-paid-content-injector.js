/**
 * After-post paid content injector
 *
 * Injects paid content code on any post using the standard post template.
 */
(function($, window, undefined){
	
	var scriptName = 'PAIDCONTENT INJECTOR',
		version = '0.5';

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

	if (winDef('NO_PAIDCONTENT')) {
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
	if (w > 800 || w < 300) {
		log('Main article width is suspicious, ejecting.');
		return false;
	}

	// Find the parent column
	var $column = $main_article.parents('.column');
	if ( ! $column.length) {
		log('Could not determine main page article\'s parent column');
		return false;
	}

	var creator = {
		'el': function(type, attr) {
			var el = d.createElement(type);
			if (attr !== null && (typeof attr === 'function') || (typeof attr === 'object')) {
				for (var i in attr) {
					el.setAttribute(i, attr[i]);
				}
			}
			return el;
		},
		'script': function(srcUrl, attr) {
			var mergedAttr = Object.assign(
				{},
				{
					type: 'text/javascript',
					async: true,
					src: srcUrl					
				},
				attr
			);
			var scr = creator.el('script', mergedAttr);
			return scr;
		},
		'iframe': function(attr, html) {
			var ifr = creator.el('iframe', attr);
			ifr.onload = function() {
				ifr.contentWindow.document.open();
				ifr.contentWindow.document.write(html);
				ifr.contentWindow.document.close();
				ifr.onload = false;
			};
			return ifr;
		}
	};

	log('Injecting content');

	// Create the injection point
	var injectPoint = creator.el(
		'div',
		{
			id: "PAIDCONTENT-" + Math.ceil(Math.random()*6000000),
			style: 'position: relative !important; float: left !important; width: 100% !important'
		}
	);
	$column.append(injectPoint);

	// Zergnet code
	/*
	var zergnet = document.createElement('script');
	zergnet.type = 'text/javascript'; zergnet.async = true;
	zergnet.src = (document.location.protocol.toLowerCase() === "https:" ? "https:" : "http:") + '//www.zergnet.com/zerg.js?id=61785';
	var znscr = document.getElementsByTagName('script')[0];
	znscr.parentNode.insertBefore(zergnet, znscr);
	*/

	// Hindsight code
	// <script src="https://static.solutionshindsight.net/teju-webclient/teju-webclient.min.js"></script>
	if ( ! winDef('NO_HINDSIGHT')) {
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
			var hindsight = creator.script(hsurl);
			injectPoint.appendChild(hindsight);
			log('Hindsight injected');
		}
	}

	// Newsmax code
	if ( ! winDef('NO_NEWSMAX')) {
		var nmurl = '//static.newsmaxfeednetwork.com/web-clients/bootloaders/jtPvahXLC0BvyCYESN3Fgu/bootloader.js';
		if (window.matchMedia("only screen and (max-width: 760px)").matches) {
			nmurl = '//static.newsmaxfeednetwork.com/web-clients/bootloaders/Jx44GJqslQrQU3ZULtFwdD/bootloader.js';
		}
		var newsmax = creator.script(
			nmurl,
			{
				'data-version': '3',
				'data-url': document.location.href,
				'data-zone': '[ZONE]',
				'data-display-within-iframe': 'true'
			}
		);
		injectPoint.appendChild(newsmax);
		log('Newsmax injected.');
	}

}(jQuery, window.self));