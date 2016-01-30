;(function(window,undefined){
	// Constants
	window._CMLS.const.PLAYER_TUNEGENIE = 8471;
	window._CMLS.const.PLAYER_TRITON = 8468;
	window._CMLS.const.PLAYER_POSITION_TOP = 80847980;
	window._CMLS.const.PLAYER_POSITION_BOTTOM = 80667984;

	/**
	 * Determines which resident player is active on the site, and its position
	 * @return {object} Player type and position
	 */
	window._CMLS.whichPlayer = function() {
		if (window._CMLS.whichPlayerCache) {
			return window._CMLS.whichPlayerCache;
		}
		var discovered = {
			type: null,
			position: null,
		};
		if (window.tgmp) {
			window._CMLS.logger('COMMON', ['Found TuneGenie player.']);
			discovered.type = window._CMLS.const.PLAYER_TUNEGENIE;
			if (window.tgmp.options.position && window.tgmp.options.position.toLowerCase() === 'bottom') {
				window._CMLS.logger('COMMON', ['TuneGenie player is on the bottom.']);
				discovered.position = window._CMLS.const.PLAYER_POSITION_BOTTOM;
			} else if (window.tgmp.options.position && window.tgmp.options.position.toLowerCase() === 'top') {
				window._CMLS.logger('COMMON', ['TuneGenie player is on the top.']);
				discovered.position = window._CMLS.const.PLAYER_POSITION_TOP;
			}
		} else if (window.TDPW) {
			window._CMLS.logger('COMMON', ['Found Triton player, assuming it\'s on top.']);
			discovered.type = window._CMLS.const.PLAYER_TRITON;
			discovered.position = window._CMLS.const.PLAYER_POSITION_TOP;
		}
		window._CMLS.whichPlayerCache = discovered;
		return window._CMLS.whichPlayerCache;
	};
}(window));