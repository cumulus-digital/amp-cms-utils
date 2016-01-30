/**
 * Initializes namespace
 */

;(function(window, undefined) {

	window._CMLS = window._CMLS || {};

	// Don't load if we're already loaded.
	if (window._CMLS.LOADED) {
		return;
	}
	window._CMLS.LOADED = true;

	// Constants
	window._CMLS.const = window._CMLS.const || {};

	/**
	 * Uses current location pathname to determine if we're on the homepage.
	 * NOTE: With TuneGenie's player, scripts using this function should only
	 * execute after page load.
	 * @return {Boolean}
	 */
	window._CMLS.isHomepage = function() {
		return window.location.pathname === '/' && /[\?&]?p=/i.test(window.location.search) === false;
	};

	/**
	 * Returns a numeric representation of the current time.
	 * (from Underscore.js)
	 * @return {number} Current time
	 */
	window._CMLS.now = Date.now || function() {
		return new Date().getTime();
	};

}(window));