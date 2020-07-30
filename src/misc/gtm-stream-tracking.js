/**
 * Listens for and logs player events from the embedded site player to GTM
 */
/* globals corpDataLayer, sharedContainerDataLayer */
;(function($, window, undefined){

	var scriptName = 'GTM STREAM TRACKING',
		nameSpace = 'GTMStreamTracker',
		version = '0.3';

	window._CMLS[nameSpace] = true;

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	/**
	 * Only load if TG player is enabled
	 */
	if ( ! window.top.tgmp || ! window.top.tgmp.addEventListener) {
		log('TGMP not available or not able to listen to events.');
		return;
	}

	if (window._CMLS[nameSpace]) {
		log('Already loaded, ejecting.');
		return;
	}


	function fireEvent(ev) {
		try {
			log('Event fired: ' + ev);
			sharedContainerDataLayer.push({'event': ev});
			corpDataLayer.push({'event': ev});
		} catch(e){}
	}

	window.top.tgmp.addEventListener(window.top.TGMP_EVENTS.streamplaying, function(e){
		if (e === true) {
			log('Stream started.');
			fireEvent('siteplayer-stream-playing');
		} else if (e === false) {
			log('Stream stopped.');
			fireEvent('siteplayer-stream-stopped');
		}
	});

	window.addEventListener('td-player.playing', function(){
		fireEvent('siteplayer-stream-playing');
	});
	window.addEventListener('td-player.stopped', function(){
		fireEvent('siteplayer-stream-stopped');
	});

	log('Initialized.');

}(jQuery, window));