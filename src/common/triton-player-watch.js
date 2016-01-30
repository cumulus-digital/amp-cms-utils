/**
 * Watches for changes in stream status on Triton's player and emits events
 */
;(function(window, undefined){
	
	var scriptName = 'PLAYER WATCH',
		nameSpace = 'playerWatch',
		version = '0.6',
		_CMLS = window._CMLS;

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
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

	function TritonPlayerWatch(){
		var cache = {},
			timer,
			interval = 2500,
			STATE = {
				PLAYING: 1,
				STOPPED: 0
			},
			that = this;

		/**
		 * Loads current data from local storage, sets state and song
		 * @return {Boolean}	Returns true if state was retrieved.
		 */
		this.checkCurrentTrack = function(){
			var currentTrack = localStorage && JSON ? JSON.parse(
				localStorage.getItem(
					'tdas.controller.' +
						window.amp_player_config.station +
							'.' +
								window.amp_player_config.stream_id +
									'.events.current-state'
				)
			) : false;

			if ( ! currentTrack || ! currentTrack.data) {
				return false;
			}

			// Check the current play state
			if (
				currentTrack.data.stream &&
				currentTrack.data.stream.code.toUpperCase() === 'LIVE_PLAYING'
			) {
				that.setState(STATE.PLAYING);
			} else {
				that.setState(STATE.STOPPED);
			}

			// Check for new song
			if (
				currentTrack.data.song &&
				currentTrack.data.song.id &&
				that.hasTrackChanged(currentTrack.data.song.id)
			) {
				that.trackHasChanged(currentTrack.data.song);
			}

			return true;
		};

		/**
		 * If the player's play state has changed, cache the state and
		 * emit playing/stopped events
		 * @param {Number} state State constant
		 */
		this.setState = function(state){
			if (state === cache.state) {
				return;
			}
			switch(state) {
				case STATE.PLAYING:
					log('Player is streaming.');
					_CMLS.triggerEvent(window, 'td-player.playing');
					break;
				default:
					log('Player is stopped.');
					_CMLS.triggerEvent(window, 'td-player.stopped');
			}
			cache.state = state;
		};

		/**
		 * Tests a given track ID against cache
		 * @param  {string}  id track ID
		 * @return {Boolean}
		 */
		this.hasTrackChanged = function(id){
			if (id && id !== cache.trackId) {
				return true;
			}
			return false;
		};

		/**
		 * Stores updated track info and triggers event
		 * @param  {Object} data Song data
		 * @return {void}
		 */
		this.trackHasChanged = function(data){
			log('Song has changed!', data);
			cache.trackId = data.id;
			_CMLS.triggerEvent(window, 'td-player.trackchange', data);
		};

		/**
		 * Starts timer
		 * @return {void}
		 */
		this.startTimer = function(){
			clearTimeout(timer);
			timer = null;
			timer = setTimeout(function() {
				that.checkCurrentTrack();
				that.startTimer();
			}, interval);
		};

		log('Initializing.');
		if (
			! window.amp_player_config ||
			! window.amp_player_config.station ||
			! window.amp_player_config.stream_id
		) {
			log('Player configuration not available, exiting.');
			return false;
		}

		// Init caches with current track
		this.checkCurrentTrack();

		// Begin tracking player
		this.startTimer();
		log('Initialized.');
		return this;
	}

	window._CMLS[nameSpace] = new TritonPlayerWatch();

}(window));