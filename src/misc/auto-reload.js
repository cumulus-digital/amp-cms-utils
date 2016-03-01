;(function(window, undefined){

	var scriptName = 'AUTO-RELOAD PAGE',
		nameSpace = 'autoReloader',
		version = '0.9';

	try {
		window._CMLS[nameSpace].stop();
		window.top._CMLS[nameSpace].stop();
	} catch(e) {}


	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	function AutoReloader(){
		var defaults = {
			condition: 'body.home',
			reload_at: null
		};

		var settings = defaults,
			timer,
			player = window._CMLS.whichPlayer(),
			that = this;

		function checkCondition(){
			if (player.type === window._CMLS.const.PLAYER_TUNEGENIE && window.page_frame) {
				return window.page_frame.document.querySelector(settings.condition);
			}
			return window.document.querySelector(settings.condition);
		}

		function getNewTimestamp(offset) {
			return new Date(Date.now() + offset);
		}

		this.start = function(options) {
			log('Starting timer.', options);

			that.stop();

			settings = {
				condition: options.condition || defaults.condition,
				reload_at: options && options.timeout ? getNewTimestamp(options.timeout*60000) : getNewTimestamp(400000)
			};

			if ( ! checkCondition()) {
				log('Condition check failed at start.');
				that.stop();
				return;
			}

			log('Starting countdown, reloading at ' + settings.reload_at);

			clearInterval(timer);
			timer = setInterval(that.tick, 10000);
		};

		this.stop = function(){
			if (timer) {
				log('Stopping timer.');
				clearInterval(timer);
				timer = null;
			}
		};

		this.tick = function(){
			log(getNewTimestamp(0), settings.reload_at, getNewTimestamp(0).getTime() > settings.reload_at.getTime());
			if (getNewTimestamp(0).getTime() > settings.reload_at.getTime()) {
				that.stop();
				that.fire();
			}
		};

		this.fire = function(){
			that.stop();
			if (checkCondition()) {
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
			} else {
				log('Condition check failed, will not reload and timer is stopped.');
			}
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