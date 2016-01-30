/**
 * Watches for changes in stream status on Triton's player and emits events
 */
;(function(window, undefined){
	
	var scriptName = 'PLAYER WATCH',
		nameSpace = 'playerWatch',
		version = '0.6',
		_CMLS = window._CMLS;

	function log() {
		window._CMLS.log(scriptName + ' v' + version, arguments);
	}

	if (_CMLS[nameSpace]) {
		return false;
	}

	function PlayerEventEmitter(){
		this.trackChange = function(data){
			log('Track has changed.', data);
			_CMLS.triggerEvent(window, 'cmls-player.trackchange', data);
		};

		this.playing = function(){
			log('Player is streaming.');
			_CMLS.triggerEvent(window, 'cmls-player.playing');
		};

		this.stopped = function(){
			log('Player is stopped.');
			_CMLS.triggerEvent(window, 'cmls-player.stopped');
		};
	}

	function TuneGeniePlayerWatch(){
		var emitter = new PlayerEventEmitter();

		window.tgmp.addEventListener(
			window.top.TGMP_EVENTS.nowplaying,
			function(data){
				emitter.trackChange(data);
			}
		);
		window.tgmp.addEventListener(
			window.top.TGMP_EVENTS.streamplaying,
			function(state){
				if (state === true) {
					emitter.playing();
				} else {
					emitter.stopped();
				}
			}
		);
	}

	function TritonPlayerWatch(){
		var cache = {},
			timer,
			interval = 2500,
			STATE = {
				PLAYING: 1,
				STOPPED: 0
			},
			emitter = new PlayerEventEmitter(),
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
					emitter.playing();
					break;
				default:
					emitter.stopped();
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
			cache.trackId = data.id;
			emitter.trackChange(data);
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

	// Initialize player tracker for player type
	var player = _CMLS.whichPlayer();
	if (player.type === _CMLS.const.PLAYER_TRITON) {
		_CMLS[nameSpace] = new TritonPlayerWatch();
		log('Triton player tracker enabled.');
	}
	if (player.type === _CMLS.const.PLAYER_TUNEGENIE) {
		_CMLS[nameSpace] = new TuneGeniePlayerWatch();
		log('TuneGenie player tracker enabled.');
	}

}(window));