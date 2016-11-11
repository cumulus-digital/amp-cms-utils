/**
 * Activates any listen live button found in the social icon row
 * to start the TuneGenie stream when clicked.
 */
(function($, window, undefined){

	var scriptName = 'SOCIAL LISTEN LIVE LINK',
		nameSpace = 'socialListenLiveLink',
		version = '0.1';

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

	if ( ! window.tgmp) {
		log('TuneGenie player not enabled, exiting.');
		return;
	}

	$(function(){
		if ( ! window.top.tgmp) {
			log('TuneGenie player not enabled.');
			return;
		}

		log('Storing TGMP default configuration.');
		window.top.tgmp_default_brand = window.top.tgmp_default_brand || "" + window.top.tgmp.options.brand;

		log('Locating Listen Live button.');
		var button = $('.social-icons img[title="Listen Live!!"],.social-icons-container img[title="Listen Live!!"]').parent('a');

		if ( ! button.length) {
			log('Could not locate Listen Live button in social icons.');
			return;
		}

		button.click(function(e){
			e.preventDefault();
			log('Playing stream...');
			if (window.top.tgmp_default_brand && window.top.tgmp.options.brand !== window.top.tgmp_default_brand) {
				window.top.tgmp.update({ brand: window.top.tgmp_default_brand, autostart: true });
				return;
			}
			window.top.tgmp.playStream();
		});
		log('Social Listen Live button activated.');
	});

	window._CMLS[nameSpace] = version;
	log('Initialized.');

}(jQuery, window));