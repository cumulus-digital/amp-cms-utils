/**
 * Auto-Reload
 * Reloads homepage on a timer without interrupting stream on sites with
 * Triton's new embed player.
 */
/* globals History */
(function(window, undefined) {

	window._CMLS = window._CMLS || {};

	// Only define once
	if (window._CMLS.autoReloadReference) {
		return;
	}

	/**
	 * Reloader
	 * @param {object} options Options for reloader.  Should include parameters 'condition'
	 *                         and 'timeout'
	 * @return {object}           Returns itself.
	 */
	var Reloader = function(options) {
		this.version = '0.6';

		// CSS Selector that must be found on page for reload to fire.
		this.condition = options && options.condition ? options.condition : 'body.home';

		// Time to reload.
		this.timeout = options && options.timeout ? options.timeout * 60000 : 480000;

		this.active = false;
		this.timer = null;

		/**
		 * Logs messages to console if available and debug is on.
		 */
		this.log = function log() {
			if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
				var ts = (new Date());
				ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
				console.log('[AUTO-RELOAD ' + this.version + ']', ts, [].slice.call(arguments));
			}
		};

		/**
		 * Determines if condition selector is met.
		 * @return {boolean} True if selector is found.
		 */
		this.checkCondition = function checkCondition() {
			return window.document.querySelector(this.condition) ? true : false;
		};

		/**
		 * Resets and restarts the timer
		 */
		this.reset = function reset() {
			if (this.timer) {
				this.log('Clearing timer.');
				clearTimeout(this.timer);
				this.timer = null;
			}
			if (this.active) {
				this.log('Restarting timer.');
				var that = this;
				this.timer = setTimeout(function() {
					that.fire();
					that.reset();
				}, this.timeout);
			}
		};

		/**
		 * Reload the page.
		 * Reload event will only fire if condition is met, prevents
		 * firing if they have navigated away from the conditional page
		 * while timer is still running.
		 */
		this.fire = function fire() {
			if (this.checkCondition()) {
				this.log('Reloading the page.');
				if (window.History && window.History.Adapter) {
					History.Adapter.trigger(window, 'statechange');
				} else {
					window.location.reload();
				}
			} else {
				this.log('Condition not met.');
				this.destroy();
			}
		};

		/**
		 * Start the timer.
		 */
		this.start = function start() {
			this.log('Starting timer.');
			this.active = true;
			this.reset();
		};

		/**
		 * Stop the timer.
		 */
		this.stop = function stop() {
			this.log('Stopping timer.');
			this.active = false;
			this.reset();
		};

		/**
		 * Destroy the timer.
		 */
		this.destroy = function destroy() {
			this.log('Destroying timer.');
			this.stop();
		};

		/**
		 * Initialize reloader and start timer.
		 */
		this.start();
		this.log('Initialized');
		window._CMLS.autoReloadReference = this;
		return this;

	};

	function resetRequestArray() {
		window._CMLS.autoReload = new ReloaderArray();
	}

	function process() {
		var options = window._CMLS.autoReload.slice(-1)[0];
		window._CMLS.autoReloadInstance = new Reloader(options);
		resetRequestArray();
	}

	var ReloaderArray = function(){};
	ReloaderArray.prototype = [];
	ReloaderArray.prototype.originalPush = ReloaderArray.prototype.push;
	ReloaderArray.prototype.push = function() {
		for (var i = 0; i < arguments.length; i++) {
			this.originalPush(arguments[i]);
		}
		process();
	};

	if (window._CMLS.autoReload && window._CMLS.autoReload.length) {
		process();
	}

	resetRequestArray();

}(window));