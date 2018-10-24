/**
 * Emit GTM events when tab visibility changes
 */
(function(w, undefined){

	var scriptName = 'GTM TAB VISIBILITY TRACKING',
		nameSpace = 'GTMTabVisibilityTracker',
		version = '0.1';

	window._CMLS[nameSpace] = true;

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	var hidden, visibilityChange; 
	if (typeof w.document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof w.document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
	} else if (typeof w.document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof w.document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	} else if (typeof w.document.oHidden !== "undefined") {
		hidden = "oHidden";
		visibilityChange = "ovisibilitychange";
	}

	var start = w._CMLS.now();

	function fireEvent(ev, state, time) {
		try {
			log('Event fired: ' + ev, state, time);
			sharedContainerDataLayer.push({'event': ev, 'page-visible': state, 'time-change': time});
			corpDataLayer.push({'event': ev, 'page-visible': state, 'time-change': time});
		} catch(e){}
	}

	function handleVisibilityChange(state) {
		var changeTime = Math.round((w._CMLS.now() - start) / 1000);
		if (state !== true && state !== false) {
			state = w.document[hidden] ? false : true;
		}
		fireEvent('page-visibility', state, changeTime);
		start = w._CMLS.now();
	}

	w.document.addEventListener(visibilityChange, function() {
		handleVisibilityChange();
	}, false);

}(window.self));