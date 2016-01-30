;(function(window, undefined){
	/**
	 * General use logger.  Picks a random color for the caller and outputs
	 * logging statements if debug is active.
	 */
	window._CMLS.log = function cmlsLog() {
		var logger = window._CMLS.log;

		// Only output logs if debug is active and console exists
		if (
			! (window._CMLS && window._CMLS.debug) ||
			! (typeof console === 'object' && console.groupCollapsed)
		) {
			return false;
		}

		logger.colorCache = logger.colorCache || {};

		var background, complement,
			name = arguments[0],
			message = [].slice.call(arguments[1]);

		// Use cached color if possible
		if (logger.colorCache[name]) {
			background = logger.colorCache[name].background;
			complement = logger.colorCache[name].complement;
		} else {
			// Calculate a random color and its complement
			background = ("000000" + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
			complement = parseInt(background, 16) >= 0xbbbbbb ? '000000' : 'FFFFFF';
			logger.colorCache[name] = {
				background: background,
				complement: complement
			};
		}

		// Generate timestamp
		var ts = (new Date());
		ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();

		var header = ['%c[' + name + ']', 'background: #' + background + '; color: #' + complement];
		message = header.concat(message);

		console.groupCollapsed.apply(console, message);
		console.log('TIMESTAMP:', ts);
		console.trace();
		console.groupEnd();
	};
}(window));