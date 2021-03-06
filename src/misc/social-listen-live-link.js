/**
 * Activates any listen live button found in the social icon row
 * to start the TuneGenie stream when clicked.
 */
(function($, window, undefined){

	var scriptName = 'SOCIAL LISTEN LIVE LINK',
		nameSpace = 'socialListenLiveLink',
		version = '0.5';

	window._CMLS = window._CMLS || {};

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	log('Starting...');

	// Only run once.
	/*
	if (window._CMLS[nameSpace]) {
		log('Already loaded, exiting.');
		return;
	}
	*/

	function initSocialListenLive(tries) {
		if ( ! window.top.tgmp) {
			if (tries < 11) {
				log ('TuneGenie player not found, checking again in 1s. (' + tries + ' tries)');
				return setTimeout(function(){ initSocialListenLive(++tries); }, 1000);
			}
			log('TuneGenie player not enabled.');
			return;
		}

		log('Storing TGMP default configuration.');
		window.top.tgmp_default_brand = window.top.tgmp_default_brand || "" + window.top.tgmp.options.brand;
		window.top.tgmp_default_theme = window.top_tgmp_default_theme || window.top.tgmp.options.theme;

		function playStream(e) {
			e.preventDefault();
			log('Playing stream...');
			if (window.top.tgmp_default_brand && window.top.tgmp.options.brand !== window.top.tgmp_default_brand) {
				window.top.tgmp.update({ brand: window.top.tgmp_default_brand, theme: window.top.tgmp_default_theme, autostart: true });
				return;
			}
			window.tgmp.playStream();
		}

		var llSelectors = 
				'.block-type-social a:has(img[title="Listen Live!!"]),' +
				'.block-type-social a:has(img[alt="Listen Live!!"]),' +
				'.block-type-social a[title="Listen Live!!"],' +
				'.block-type-social a[alt="Listen Live!!"],' +
				'.nav-listenlive a,' +
				'.nav-listenlive img,' +
				'.cmlistenlive-start';

		$('body')
			.off('click', llSelectors, playStream)
			.on('click', llSelectors, playStream);

		log('Social Listen Live button activated.');
	}

	$(initSocialListenLive(1));

	window._CMLS[nameSpace] = version;
	log('Initialized.');

}(jQuery, window.self));