/**
 * When requested, reloads a site on a timer without interrupting the stream
 */
;(function(window, undefined){
	
	var scriptName = 'AUTO-RELOAD PAGE',
		nameSpace = 'autoReloader',
		version = '0.8',
		_CMLS = window._CMLS || {};

	if (_CMLS[nameSpace] || window.self.teads){
		return;
	}

	function log() {
		_CMLS.log(scriptName + ' v' + version, arguments);
	}

	function AutoReloader(options) {
		var settings = {
			condition: options && options.condition ? options.condition : 'body.home',
			timeout: options && options.timeout ? options.timeout*60000 : 400000
		};

		var active = false,
			timer,
			player = _CMLS.whichPlayer(),
			that = this;

		/**
		 * Check if CSS condition for reloading is good
		 * @return {Boolean}
		 */
		function checkCondition() {
			return window.self.document.querySelector(settings.condition);
		}

		/**
		 * Reset the timer
		 * @return {void}
		 */
		this.reset = function(){
			log('Resetting timer.');
			clearTimeout(timer);
			timer = null;
			that.restart();
		};

		/**
		 * Stop the timer
		 * @return {void}
		 */
		this.stop = function(){
			log('Stopping timer.');
			active = false;
			clearTimeout(timer);
			timer = null;
		};

		/**
		 * Start the timer after a condition check
		 * @return {void}
		 */
		this.start = function(){
			if ( ! checkCondition()) {
				log('Condition check failed, will not start timer.');
				active = false;
				that.stop();
				return;
			}
			log('Starting countdown at ' + (settings.timeout / 60000) + ' minutes.');
			active = true;
			that.restart();
		};

		/**
		 * If active and condition is good, restart the timer.
		 * @return {void}
		 */
		this.restart = function(){
			if (active && checkCondition()) {
				clearTimeout(timer);
				timer = setTimeout(function(){
					that.fire();
					that.reset();
				}, settings.timeout);
			} else {
				active = false;
			}
		};

		this.destroy = function(){
			log('Destroying timer.');
			that.stop();
			that = null;
		};

		/**
		 * Check conditions and fire a reload event depending on the installed player
		 * @return {void}
		 */
		this.fire = function(){
			if (active && checkCondition()) {
				log('Reloading the page.');
				if (player.type === _CMLS.const.PLAYER_TRITON && window.History && window.History.Adapter) {
					window.History.Adapter.trigger(window, 'statechange');
					return;
				}
				if (player.type === _CMLS.const.PLAYER_TUNEGENIE) {
					window.tgmp.updateLocation(window.self.location.href);
					return;
				}
				window.location.reload();
			} else {
				log('Fired after conditions changed, self-destructing.');
				this.destroy();
			}
		};

		log('Initialized.', settings);
		this.start();

	}

	// Handle any existing requests
	if (window._CMLS.autoReload && window._CMLS.autoReload.length) {
		window._CMLS.autoReload.forEach(function(options){
			return new AutoReloader(options);
		});
	}

	// Handle future requests
	var ReloaderArray = function(){};
	ReloaderArray.prototype = [];
	ReloaderArray.prototype.push = function(options){
		return new AutoReloader(options);
	};
	window._CMLS.autoReload = new ReloaderArray();

}(window));