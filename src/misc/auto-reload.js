;(function(window, undefined){
	
	var scriptName = 'AUTO-RELOAD PAGE',
		nameSpace = 'autoReloader',
		version = '0.9';

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	try {
		window._CMLS[nameSpace].stop();
		window.top._CMLS[nameSpace].stop();
	} catch(e){}

	function AutoReloader(){
		var defaults = {
			condition: 'body.home',
			timeout: 8
		};

		var settings = defaults,
			interval,
			reload_at,
			player = window._CMLS.whichPlayer(),
			that = this;

		function checkCondition(){
			if (player.type === window._CMLS.const.PLAYER_TUNEGENIE && window.page_frame) {
				return window.page_frame.document.querySelector(settings.condition);
			}
			return window.document.querySelector(settings.condition);
		}

		function getDateWithOffset(offset) {
			return new Date(Date.now() + offset);
		}

		this.start = function(options) {
			log('Starting timer.', options);

			that.stop();

			settings = {
				condition: options.condition || defaults.condition,
				timeout: options.timeout || defaults.timeout
			};

			if ( ! checkCondition()) {
				log('Condition check failed at start.');
				return;
			}

			reload_at = getDateWithOffset(settings.timeout*60000);

			log('Starting countdown, reloading at ' + reload_at);

			interval = setInterval(that.tick, 10000);
		};

		this.stop = function() {
			if (interval) {
				log('Stopping timer.');
				clearInterval(interval);
				interval = null;
			}
		};

		this.tick = function() {
			if (Date.now() > reload_at.getTime()) {
				that.fire();
			}
		};

		this.fire = function() {
			if ( ! checkCondition()) {
				log('Condition check failed before firing, timer stopped.');
				that.stop();
				return;
			}

			log('Reloading page.');
			if (player.type === window._CMLS.const.PLAYER_TRITON && window.History && window.History.Adapter) {
				window.History.Adapter.trigger(window, 'statechange');
				return;
			}
			if (player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
				window.tgmp.updateLocation(window.self.location.href);
				return;
			}
			window.location.reload();
		};
	}

	window._CMLS[nameSpace] = new AutoReloader();

	// Handle existing requests
	if (window._CMLS.autoReload && window._CMLS.autoReload.length) {
		log('Loaded with request.', window._CMLS.autoReload);
		window._CMLS[nameSpace].start(window._CMLS.autoReload[window._CMLS.autoReload.length-1]);
	}

	// Handle future requests
	var ReloaderArray = function(){};
	ReloaderArray.prototype = [];
	ReloaderArray.prototype.push = function(options){
		window._CMLS[nameSpace].start(options);
	};
	window._CMLS.autoReload = new ReloaderArray();

}(window));