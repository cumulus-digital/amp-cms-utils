/**
 * Watches for changes to song data from Triton player,
 * updates DFP targeting criteria.
 */
(function(window, undefined) {

	var scriptName = 'PLAYER WATCH',
		nameSpace = 'playerWatch',
		version = '0.5';

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	// Only define once
	if (window._CMLS[nameSpace]) {
		return false;
	}

	// Only operate if we're using Triton's player
	if ( ! window.TDPW) {
		log('Triton player not enabled, exiting.');
		return false;
	}

	window._CMLS[nameSpace] = {
		initialized: false,
		cache: {},
		timer: null,
		interval: 2500,

		const: {
			STOPPED: 0,
			PLAYING: 1
		},

		/**
		 * Sets targeting criteria in DFP
		 * @param {string} key   DFP targeting key
		 * @param {string} value DFP target value
		 */
		setDFPCriteria: function setDFPCriteria(key, value) {
			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];
			window.googletag.cmd.push(function() {
				log('Setting targeting', key, value);
				window.googletag.pubads().setTargeting(key, value);
			});
		},

		/**
		 * Loads current track info from local storage, sets state.
		 * @return {[type]} [description]
		 */
		checkCurrentTrack: function getCurrentTrack() {
			var currentTrack = localStorage && JSON ? JSON.parse(
				localStorage.getItem(
					'tdas.controller.' + 
					window.amp_player_config.station +
					'.' +
					window.amp_player_config.stream_id +
					'.events.current-state'
				)
			) : false;
			
			if (
				currentTrack &&
				currentTrack.data
			) {

				// Check and store the current play state
				if (
					currentTrack.data.stream &&
					currentTrack.data.stream.code.toUpperCase() === 'LIVE_PLAYING'
				) {
					this.setState(this.const.PLAYING);
				} else {
					this.setState(this.const.STOPPED);
				}

				// Check if song differs from cache
				if (
					currentTrack.data.song &&
					currentTrack.data.song.id &&
					this.hasTrackChanged(currentTrack.data.song.id)
				) {
					this.trackHasChanged(currentTrack.data.song);
				}

			}
		},

		/**
		 * Check if given state differs from cache, if so store it, set
		 * DFP criteria, and trigger events
		 * @param {Number} state Number representing state constant
		 */
		setState: function setState(state) {
			if (state === this.const.PLAYING && state !== this.cache.state) {
				log('Player is streaming.');
				this.cache.state = state;
				this.setDFPCriteria('td-player-state', 'PLAYING');
				window._CMLS.triggerEvent(window, 'td-player.playing');
				return;
			}
			if (state === this.const.STOPPED && state !== this.cache.state) {
				log('Player is stopped.');
				this.cache.state = state;
				this.setDFPCriteria('td-player-state', 'STOPPED');
				window._CMLS.triggerEvent(window, 'td-player.stopped');
				return;
			}
		},

		/**
		 * Tests a given track ID against cache
		 * @param  {string}  id Track ID
		 * @return {Boolean}
		 */
		hasTrackChanged: function hasTrackChanged(id) {
			if (id && id !== this.cache.trackId) {
				return true;
			}
			return false;
		},

		/**
		 * Stores updated track info, sets DFP criteria, and triggers
		 * td-player.trackchange event.
		 * @param  {Object} data Data concerning song
		 * @return {void}
		 */
		trackHasChanged: function trackHasChanged(data) {
			log('Song has changed!', data);
			this.cache.trackId = data.id;
			if (data.artist) {
				this.setDFPCriteria('td-player-artist', data.artist);
			}
			if (data.album) {
				this.setDFPCriteria('td-player-album', data.album);
			}
			if (data.title) {
				this.setDFPCriteria('td-player-track', data.title);
			}
			this.setDFPCriteria('td-player-id', data.id);
			window._CMLS.triggerEvent(window, 'td-player.trackchange', data);
		},

		/**
		 * Starts timer
		 * @return {void}
		 */
		startTimer: function startTimer() {
			var that = this;
			clearTimeout(this.timer);
			this.timer = null;
			this.timer = setTimeout(function() {
				that.checkCurrentTrack();
				that.startTimer();
			}, this.interval);
		},

		/**
		 * Initializes library, filling caches and starting the timer.
		 * @return {Object} Returns itself.
		 */
		init: function init() {
			if (
				! window.amp_player_config ||
				! window.amp_player_config.station ||
				! window.amp_player_config.stream_id
			) {
				log('Player configuration not available, exiting.');
				return false;
			}

			// Refresh and check current track data
			this.checkCurrentTrack();

			this.startTimer();
			this.initialized = true;
			log('Initialized!', this.cache.trackId);
			return this;

		}
	};

	window._CMLS[nameSpace].init();

}(window));