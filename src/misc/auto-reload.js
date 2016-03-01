/**
 * When enabled, reloads homepage on a timer without interrupting stream.
 */
(function(window, undefined) {

	var scriptName = 'AUTO-RELOADER',
		nameSpace = 'autoReloader',
		version = '0.7';

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	// Only define once
	if (window._CMLS[nameSpace]) {
		log('Already active!');
		return;
	}

	window._CMLS[nameSpace] = {
		condition: 'body.home',
		timeout: 480000,
		active: false,
		timer: null,
		player: window._CMLS.whichPlayer(),

		/**
		 * Checks if condition selector exists
		 * @return {Boolean}
		 */
		checkCondition: function checkCondition() {
			return window.document.querySelector(this.condition) ? true : false;
		},

		reset: function reset() {
			log('Resetting.');
			clearTimeout(this.timer);
			this.timer = null;
			this.restart();
		},

		start: function start() {
			if ( ! this.checkCondition()) {
				log('Condition check failed, exiting.');
				this.active = false;
				return false;
			}
			log('Starting timer.');
			this.active = true;
			this.reset();
		},

		stop: function stop() {
			log('Stopping timer.');
			this.active = false;
			this.reset();
		},

		restart: function restart() {
			if (this.active && this.checkCondition()) {
				log('Restarting timer.', this.timeout);
				var that = this;
				clearTimeout(this.timer);
				this.timer = setTimeout(function() {
					that.fire();
					that.reset();
				}, this.timeout);
			} else {
				this.active = false;
			}
		},

		destroy: function destroy() {
			log('Destroying timer.');
			this.stop();
		},

		fire: function fire() {
			if (this.checkCondition()) {
				log('Reloading the page.');
				if (this.player.type === window._CMLS.const.PLAYER_TRITON) {
					window.History.Adapter.trigger(window, 'statechange');
					return;
				}
				if (this.player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
					window.tgmp.updateLocation(window.location.href);
					return;
				}
				window.location.reload();
				this.restart();
			} else {
				log('Condition not met, self-destructing.');
				this.destroy();
			}
		},

		init: function init(options) {
			this.condition = options.condition || this.condition;
			this.timeout = options.timeout * 60000 || this.timeout;
			this.start();
			log('Initialized.', this.timeout, this.condition);
		}

	};

	var ReloaderArray = function() {};
	ReloaderArray.prototype = [];
	ReloaderArray.prototype._push = ReloaderArray.prototype.push;
	ReloaderArray.prototype.push = function() {
		for (var i = 0; i < arguments.length; i++) {
			this._push(arguments[i]);
		}
		window._CMLS[nameSpace].init(this.slice(-1)[0]);
		resetRequestArray();
	};

	function resetRequestArray() {
		window._CMLS.autoReload = new ReloaderArray();
	}

	if (window._CMLS.autoReload && window._CMLS.autoReload.length) {
		window._CMLS[nameSpace].init(window._CMLS.autoReload.slice(-1)[0]);
	}

	resetRequestArray();

}(window.top === window.self ? window : window.top));