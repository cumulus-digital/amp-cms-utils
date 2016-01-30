;(function(window, undefined){
	/**
	 * Debounce (from Underscore.js)
	 * @param  {function} func      Function to debounce
	 * @param  {number}   wait      Milliseconds between executions
	 * @param  {boolean}  immediate Flag to toggle execution point, true for leading, 
	 *                              false for trailing wait window
	 * @return {function}           Debounced wrapper for func
	 */
	window._CMLS.debounce = function(func, wait, immediate) {
		var timeout, args, context, timestamp, result;

		var later = function() {
			var last = window._CMLS.now() - timestamp;

			if (last < wait && last >= 0) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if ( ! immediate) {
					result = func.apply(context, args);
					if ( ! timeout) {
						context = args = null;
					}
				}
			}
		};

		var debounced = function() {
			context = this;
			args = arguments;
			timestamp = window._CMLS.now();
			var callNow = immediate && ! timeout;
			if ( ! timeout) {
				timeout = setTimeout(later, wait);
			}
			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}

			return result;
		};

		debounced.clear = function() {
			clearTimeout(timeout);
			timeout = context = args = null;
		};

		return debounced;
	};
}(window));