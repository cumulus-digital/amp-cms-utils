;(function(window, undefined){
	/**
	 * Lightweight, cross-browser event trigger
	 * @param  {Object} el    Element to trigger on
	 * @param  {string} name  Name of event
	 * @param  {*}      data  Data to send with event
	 * @return {void}
	 */
	window._CMLS.triggerEvent = function(el, name, data) {
		var event;
		if (window.document.createEvent) {
			event = window.document.createEvent('CustomEvent');
			event.initCustomEvent(name, true, true, data);
		} else {
			event = new CustomEvent(name, { 'detail': data });
		}
		el.dispatchEvent(event);
	};	
}(window));