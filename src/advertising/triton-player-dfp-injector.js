/**
 * Listens for events from Triton's player and sets DFP targeting criteria
 */
;(function(window, undefined){
	var scriptName = 'PLAYER DFP INJECTOR',
		nameSpace = 'playerDFPInjector',
		version = '0.1',
		_CMLS = window._CMLS || {};

	function log() {
		window._CMLS.log(scriptName + ' v' + version, arguments);
	}

	if (_CMLS[nameSpace]) {
		return false;
	}

	// Only operate on Triton's player.
	var player = _CMLS.whichPlayer();
	if (player.type !== _CMLS.const.PLAYER_TRITON) {
		log('Triton player not enabled.');
		return false;
	}

	function TritonPlayerDFPInjector() {
		var that = this;

		/**
		 * Wrapper around setting DFP criteria
		 * @param {string} key DFP targeting key
		 * @param {string} val DFP target value
		 */
		this.setDFPCriteria = function(key, val) {
			window.googletag.cmd.push(function() {
				log('Setting targeting criteria.', key, val);
				window.googletag.pubads().setTargeting(key, val);
			});
		};

		// Set event listeners
		window.addEventListener(
			'cmls-player.playing',
			function(){
				log('Player is streaming.');
				that.setDFPCriteria('td-player-state', 'PLAYING');
			},
			false
		);
		window.addEventListener(
			'cmls-player.stopped',
			function(){
				log('Player has stopped.');
				that.setDFPCriteria('td-player-state', 'STOPPED');
			},
			false
		);
		window.addEventListener(
			'cmls-player.trackchange',
			function(data){
				log('Track has changed.', data);
				if (data.artist) {
					that.setDFPCriteria('td-player-artist', data.artist);
				}
				if (data.album) {
					that.setDFPCriteria('td-player-album', data.album);
				}
				if (data.title) {
					that.setDFPCriteria('td-player-track', data.title);
				}
				if (data.id) {
					that.setDFPCriteria('td-player-id', data.id);
				}
			}
		);

		log('Initialized.');
	}

	_CMLS[nameSpace] = new TritonPlayerDFPInjector();

}(window));