/**
 * Listens for and logs player events from the TuneGenie player to Google Analytics
 */
/* globals TGMP_EVENTS, ga */
;(function($, window, undefined){

	var scriptName = 'TG GA STREAM TRACKING',
		nameSpace = 'tgGaStreamTracker',
		version = '0.2';

	/**
	 * Only load if TG player is enabled and Google Analytics is available
	 */
	if ( ! window.top.tgmp || ! ga || window._CMLS[nameSpace]) {
		return;
	}

	window._CMLS[nameSpace] = true;

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	window.top.tgmp.addEventListener(TGMP_EVENTS.streamplaying, function(e){
		if (e === true) {
			log('Stream started.');
			ga('send', 'event', 'TuneGenie', 'Stream', 'Start');
		} else if (e === false) {
			log('Stream stopped.');
			ga('send', 'event', 'TuneGenie', 'Stream', 'Stop');
		}
	});

}(jQuery, window));