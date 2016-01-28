/**
 * Activates any listen live button found in the social icon row
 * to start the TuneGenie stream when clicked.
 */
(function($, window, undefined){

	var scriptName = 'SOCIAL LISTEN LIVE LINK',
		nameSpace = 'socialListenLiveLink',
		version = '0.1';

	window._CMLS = window._CMLS || {};

	// Only run once.
	if (window._CMLS[nameSpace]) {
		return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	if ( ! window.tgmp) {
		log('TuneGenie player not enabled, exiting.');
		return;
	}

	$(function(){
		var button = $('.social-icons img[title="Listen Live!!"],.social-icons-container img[title="Listen Live!!"]').parent('a');

		if ( ! button.length) {
			log('Could not locate Listen Live button in social icons.');
			return;
		}

		button.click(function(e){
			if (window.tgmp) {
				e.preventDefault();
				log('Playing stream...');
				window.tgmp.playStream();
			}
		});
		log('Social Listen Live button activated.');
	});

}(jQuery, window));