/**
 * Listens for and logs player events from the TuneGenie player to Google Analytics
 */
/* globals TGMP_EVENTS, ga */
;(function($, window, undefined){

	/**
	 * Only load if TG player is enabled and Google Analytics is available
	 */
	if ( ! window.top.tgmp || ! ga) {
		return;
	}

	window.top.tgmp.addEventListener(TGMP_EVENTS.streamplaying, function(e){
		if (e === true) {
			ga('send', 'event', 'TuneGenie', 'Stream', 'Start');
		} else if (e === false) {
			ga('send', 'event', 'TuneGenie', 'Stream', 'Stop');
		}
	});

}(jQuery, window));