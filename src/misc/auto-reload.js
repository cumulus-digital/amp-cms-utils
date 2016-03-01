;(function(window, undefined){

	var scriptName = 'AUTO-RELOAD PAGE',
		nameSpace = 'autoReloader',
		version = '0.8',
		_CMLS = window._CMLS || {};

	try {
		_CMLS[nameSpace].stop();
		window.top._CMLS[nameSpace].stop();
	} catch(e) {}

	function log() {
		_CMLS.logger(scriptName + ' v' + version, arguments);
	}

	function AutoReloader(){
		var defaults = {
			condition: 'body.home',
			timeout: 400000
		};

		var active = false,
			settings = defaults,
			timer,
			player = _CMLS.whichPlayer(),
			that = this;

		function checkCondition(){
			return window.self.document.querySelector(settings.condition);
		}

		this.start = function(options) {
			log('Starting with options:', options);
			that.stop();
			settings = {
				condition: options && options.condition ? options.condition : defaults.condition,
				timeout: options && options.timeout ? options.timeout*60000 : defaults.timeout
			};
			if ( ! checkCondition()) {
				log('Condition check failed, will not start.');
				active = false;
				that.stop();
				return;
			}
			log('Starting countdown at ' + (settings.timeout / 60000) + ' minutes.', settings);
			active = true;
			clearTimeout(timer);
			timer = setTimeout(function(){
				that.fire();
			}, settings.timeout);
		};

		this.stop = function(){
			log('Stopping timer.');
			active = false;
			clearTimeout(timer);
			timer = null;
		};

		this.fire = function() {
			if (checkCondition()) {
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
				log('Fired after conditions changed, stopping timer without reload.');
				this.stop();
			}
		};
	}

	_CMLS[nameSpace] = new AutoReloader();

	// Handle any existing requests
	if (window._CMLS.autoReload && window._CMLS.autoReload.length) {
		log('Loaded with request.', window._CMLS.autoReload);
		_CMLS[nameSpace].start(window._CMLS.autoReload[window._CMLS.autoReload.length]);
	}

	// Handle future requests
	var ReloaderArray = function(){};
	ReloaderArray.prototype = [];
	ReloaderArray.prototype.push = function(options){
		_CMLS[nameSpace].start(options);
	};
	window._CMLS.autoReload = new ReloaderArray();

}(window.self));