;(function(window, undefined){
	
	var scriptName = 'AUTO-RELOAD PAGE',
		//nameSpace = 'autoReload',
		version = '0.10';

	function log() {
		if (window.top._CMLS && window.top._CMLS.logger) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

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
			/*
			// Check if condition is in TuneGenie frame...
			var iframe = window.top.document.querySelector('iframe#page_frame,iframe[name="pwm_pageFrame"]');
			if (player.type === window._CMLS.const.PLAYER_TUNEGENIE && iframe && iframe.contentWindow) {
				return iframe.contentWindow.document.querySelector(settings.condition);
			}
			*/
			// Else check current window document
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

			if (window._CMLS.autoReload) {
				window._CMLS.autoReload.active = true;
			}

			interval = setInterval(that.tick, 10000);
		};

		this.stop = function() {
			if (interval) {
				log('Stopping timer.');
				clearInterval(interval);
				interval = null;
				if (window._CMLS.autoReload) {
					window._CMLS.autoReload.active = false;
				}
			}
		};

		this.tick = function() {
			if (Date.now() > reload_at.getTime()) {
				that.fire();
			}
		};

		this.fire = function() {
			that.stop();

			if ( ! checkCondition()) {
				log('Condition check failed before firing, timer stopped.');
				return;
			}

			//log('Reloading page.');
			if (player.type === window._CMLS.const.PLAYER_TRITON && window.History && window.History.Adapter) {
				log('Reloading through Triton Player.');
				window.History.Adapter.trigger(window, 'statechange');
				return;
			}
			if (player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
				log('Reloading through TuneGenie Player.');
				window.tgmp.updateLocation(window.location.href);
				return;
			}
			log('Reloading page.');
			window.location.reload();
		};

		this.push = function(options) {
			log('Received request.', options);
			that.start(options);
		};
	}

	// Handle existing requests
	var freshOptions;
	if (window._CMLS) {
		if (window._CMLS.autoReload && window._CMLS.autoReload.constructor === Array && window._CMLS.autoReload.length) {
			log('Loaded with request.', window._CMLS.autoReload);
			freshOptions = window._CMLS.autoReload[window._CMLS.autoReload.length-1];
		}

		if ( ! window._CMLS.autoReload || window._CMLS.autoReload.constructor === Array) {
			window._CMLS.autoReload = new AutoReloader();
		}
	}

	log('Initialized.');

	if (freshOptions) {
		window._CMLS.autoReload.push(freshOptions);
	}

}(window.self));