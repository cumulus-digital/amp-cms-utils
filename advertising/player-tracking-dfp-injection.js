/**
 * Watches for changes to song data from the embedded player
 * and updates DFP targeting criteria on track change.
 */
(function(window, undefined) {
	window._CMLS = window._CMLS || {};
	window._CMLS.embedPlayerWatch = {
		v: '0.1',
		initialized: false,
		trackIdCache: null,
		timer: null,
		interval: 1000,

		log: function log() {
			if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
				console.log('[PLAYER WATCH ' + this.v + ']', [].slice.call(arguments));
			}
		},

		/**
		 * Returns true if given track information differs from cache
		 * @param  {string}  current Track id string from
		 *                           tdas.controlls.STATION.STREAM.track-meta
		 *                           localStorage object.
		 * @return {Boolean}
		 */
		isChanged: function testTrack(current) {
			if (current) {
				if (current == this.trackIdCache) {
					return false;
				}
				return true;
			}
			return false;
		},

		getTrackInfo: function getTrackInfo() {
			return JSON.parse(localStorage.getItem('tdas.controller.' + amp_player_config.station + '.' + amp_player_config.stream_id + '.events.track-meta'));
		},

		getTrackId: function getTrackId() {
			var info = this.getTrackInfo();
			if (info && info.id) {
				return info.id;
			}
			return null;
		},

		checkCurrent: function checkCurrent() {
			var current = this.getTrackId();
			if (this.isChanged(current)) {
				this.log('Song changed!', current);
				this.trackIdCache = current;
				this.setCriteria(this.getTrackInfo());
			}
			this.setTimer();
		},

		setCriteria: function setCriteria(meta) {
			if (window.googletag && googletag.pubadsReady) {
				if (meta && meta.data && meta.data.data) {
					meta = meta.data.data;
					if (meta.artistName) {
						this.log('Setting Artist', meta.artistName);
						googletag.pubads().setTargeting('td-player-artist', meta.artistName);
					}
					if (meta.collectionName) {
						this.log('Setting Album', meta.collectionName);
						googletag.pubads().setTargeting('td-player-album', meta.collectionName);
					}
					if (meta.trackName) {
						this.log('Setting Track', meta.trackName);
						googletag.pubads().setTargeting('td-player-track', meta.trackName);
					}
				}
			}
		},

		setTimer: function setTimer() {
			var that = this;
			this.timer = setTimeout(function() {
				that.checkCurrent();
			}, this.interval);
		},

		init: function init() {
			if ( ! window.amp_player_config || ! window.amp_player_config.station || ! window.amp_player_config.stream_id) {
				this.log('amp_player_config not available.');
				return false;
			}

			// Retrieve current Track ID and set current track criteria
			this.trackIdCache = this.getTrackId();
			this.setCriteria(this.getTrackInfo());

			// Initialize watch timer
			this.setTimer();
			this.initialized = true;
			this.log('Initialized! Current track ID:', this.trackIdCache);
			return this;
		}

	};
	window._CMLS.embedPlayerWatch.init();
}(window));