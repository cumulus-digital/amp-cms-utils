;(function(window,undefined){
	var _CMLS = window._CMLS || {};

	// Constants
	_CMLS.const.PLAYER_TUNEGENIE = 8471;
	_CMLS.const.PLAYER_TRITON = 8468;
	_CMLS.const.PLAYER_POSITION_TOP = 80847980;
	_CMLS.const.PLAYER_POSITION_BOTTOM = 80667984;

	/**
	 * Determines which resident player is active on the site, and its position
	 * @return {object} Player type and position
	 */
	_CMLS.whichPlayer = function() {
		if (_CMLS.whichPlayer.cache) {
			return _CMLS.whichPlayer.cache;
		}
		var discovered = {
			type: null,
			position: null,
		};
		if (window.tgmp) {
			_CMLS.log('COMMON', ['Found TuneGenie player.']);
			
			discovered.type = _CMLS.const.PLAYER_TUNEGENIE;
			var options = window.tgmp.options;

			if (options.position && options.position.toLowerCase() === 'bottom') {
				_CMLS.log('COMMON', ['TuneGenie player is on the bottom.']);
				discovered.position = _CMLS.const.PLAYER_POSITION_BOTTOM;
			} else if (options.position && options.position.toLowerCase() === 'top') {
				_CMLS.log('COMMON', ['TuneGenie player is on the top.']);
				discovered.position = _CMLS.const.PLAYER_POSITION_TOP;
			}
		} else if (window.TDPW) {
			_CMLS.log('COMMON', ['Found Triton player, assuming it\'s on top.']);
			discovered.type = _CMLS.const.PLAYER_TRITON;
			discovered.position = _CMLS.const.PLAYER_POSITION_TOP;
		}
		_CMLS.whichPlayer.cache = discovered;
		return _CMLS.whichPlayer.cache;
	};
}(window));