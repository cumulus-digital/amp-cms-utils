/**
 * Watches for changes to song data from the embedded player
 * and updates DFP targeting criteria on track change.
 */
(function(window, undefined) {
	window._CMLS = window._CMLS || {};
	window._CMLS.embedPlayerWatch = {
		v: '0.3',
		initialized: false,
		trackIdCache: null,
		timer: null,
		interval: 1000,

		log: function log() {
			if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
				var ts = (new Date());
				ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
				console.log('[PLAYER WATCH ' + this.v + ']', ts, [].slice.call(arguments));
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

		getCurrentState: function getCurrentState() {
			if (localStorage) {
				return JSON.parse(localStorage.getItem('tdas.controller.' + amp_player_config.station + '.' + amp_player_config.stream_id + '.events.current-state'));
			}
			return false;
		},

		checkCurrent: function checkCurrent() {
			var current = this.getCurrentState();
			if (current && current.data && current.data.song && current.data.song.id && this.isChanged(current.data.song.id)) {
				this.log('Song changed!', current.data.song.id);
				this.trackIdCache = current.data.song.id;
				this.setCriteria(current);
			} else {
				//this.log('Song has not changed.');
			}
			this.setTimer();
		},

		setCriteria: function setCriteria(meta) {
			if (window.googletag && googletag.pubadsReady) {
				if (meta && meta.data && meta.data.song) {
					meta = meta.data.song;
					if (meta.artist) {
						this.log('Setting Artist', meta.artist);
						googletag.pubads().setTargeting('td-player-artist', meta.artist);
					}
					if (meta.album) {
						this.log('Setting Album', meta.album);
						googletag.pubads().setTargeting('td-player-album', meta.album);
					}
					if (meta.title) {
						this.log('Setting Track', meta.title);
						googletag.pubads().setTargeting('td-player-track', meta.title);
					}
					if (meta.id) {
						this.log('Setting Song ID', meta.id);
						googletag.pubads().setTargeting('td-player-id', meta.id);
					}
				}
			}
		},

		setTimer: function setTimer() {
			var that = this;
			clearTimeout(this.timer);
			this.timer = null;
			this.timer = setTimeout(function() {
				that.checkCurrent();
			}, this.interval);
		},

		init: function init() {
			if ( ! window.amp_player_config || ! window.amp_player_config.station || ! window.amp_player_config.stream_id) {
				this.log('amp_player_config not available.');
				return false;
			}

			// Retrieve current track info
			this.checkCurrent();

			// Explicitly check for track change 1 second after window load
			var that = this;
			window.addEventListener('load', function() {
				that.log('Caught window load.');
				setTimeout(function() {
					that.log('Delayed window load track check firing.');
					that.checkCurrent();
				}, 1000);
			}, false);

			// Initialize watch timer
			this.setTimer();
			this.initialized = true;
			this.log('Initialized! Current track ID:', this.trackIdCache);
			return this;
		}

	};
	window._CMLS.embedPlayerWatch.init();
}(window));