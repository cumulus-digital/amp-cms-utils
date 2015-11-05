/**
 * Receives Teads PIDs and injects Teads' scripting.
 * Local usage:
 * 	window._teadsinjector.push({
 * 		pid: '1234',
 * 		format: 'inboard'
 * 	});
 */
(function(window, undefined) {

	var scriptName = 'TEADS INJECTOR',
		nameSpace = 'teadsInjector',
		version = '0.7';

	// Only define once.
	if (window._CMLS[nameSpace] || window.teads) {
		return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	window._CMLS[nameSpace] = {
		getWindowSize: function getWindowSize() {
			var width = 1000, height = 1000;

			if (typeof window.innerWidth === 'number') {
				width = window.innerWidth;
			} else if (document.documentElement && document.documentElement.clientWidth) {
				width = document.documentElement.clientWidth;
			} else if (document.body && document.body.clientWidth) {
				width = document.body.clientWidth;
			}
			// No need for teads to get bigger than this
			if (width > 1000) {
				width = 1000;
			}

			if (typeof(window.innerHeight) === 'number') {
				height = window.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) {
				height = document.documentElement.clientHeight;
			} else if (document.body && document.body.clientHeight) {
				height = document.body.clientHeight;
			}

			return { w: width, h: height };
		},

		inboard: function inboardInjector(PID) {

			var windowSize = window._CMLS[nameSpace].getWindowSize();
			log('Injecting inboard with width ' + windowSize.w);

			window._CMLS[nameSpace].inject({
				pid: PID,
				slot: '.wrapper-content',
				format: 'inboard',
				before: true,
				css: 'margin: auto !important; padding-top: 5px; padding-bottom: 5px;',
				size: {w: windowSize.w}
			});

		},

		inread: function inreadInjector(PID) {

			window._CMLS[nameSpace].inject({
				pid: PID,
				slot: '.loop .post .entry-content p',
				filter: function() {
					var body = window.document.getElementsByTagName('body')[0];
					return body.className.indexOf('single-post') > -1;
				},
				format: 'inread',
				before: false,
				css: 'padding-bottom: 10px !important;'
			});

		},

		process: function inject(format, pid) {
			if (format && pid) {
				log('Received request for ' + format + ' with PID ' + pid);
				window._CMLS[nameSpace][format](pid);
			}
		},

		inject: function processRequest(options) {

			if ( ! options.pid || ! options.slot || ! options.format) {
				return false;
			}

			options.components = options.components || { skip: { delay: 0 }};
			options.lang = options.lang || 'en';
			options.filter = options.filter || function() { return true; }; 
			options.minSlot = options.minSlot || 0;
			options.before = options.before || false;
			options.BTF = options.BTF || false;
			options.css = options.css || 'margin: auto !important;';

			window._ttf = window._ttf || [];
				window._ttf.push(options);
				(function(d){
					var js, s = d.getElementsByTagName('script')[0];
					js = d.createElement('script'); js.async = true;
					js.src = "http://cdn.teads.tv/js/all-v1.js";
					s.parentNode.insertBefore(js, s);
				})(window.document);

			log('Injecting!', options);

		}
	};

	// Create a fake array to overload push
	var TeadsArray = function() {};
	TeadsArray.prototype = [];
	TeadsArray.prototype.push = function() {
		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i].format && arguments[i].pid) {
				window._CMLS[nameSpace].process(
					arguments[i].format,
					arguments[i].pid
				);
			}
		}
	};

	// Handle any existing requests before we loaded.
	if (window._teadsinjector && window._teadsinjector.length) {
		for (var i = 0; i < window._teadsinjector.length; i++) {
			if (window._teadsinjector[i].format && window._teadsinjector[i].pid) {
				window._CMLS[nameSpace].process(
					window._teadsinjector[i].format,
					window._teadsinjector[i].pid
				);
			}
		}
	}

	window._teadsinjector = new TeadsArray();

	log('Listening for future requests.');

}(window));