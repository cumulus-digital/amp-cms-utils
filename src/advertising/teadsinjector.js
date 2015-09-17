/**
 * National Teads injector.
 * Receives Teads PIDs and injects teads scripting
 * Usage:
 * 		window._teadsinjector.push({
 *			pid: '1234',
 *			format: 'inboard'
 *		});
 */
try {
(function(window, undefined) {

	var v = '0.6';

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			console.log('[TEADS INJECTOR ' + v + ']', [].slice.call(arguments));
		}
	}

	// Don't run in the topmost window if we're using TuneGenie's player
	if (window.tgmp && window === window.top) {
		log('Using TuneGenie player and injected in top window, ejecting.');
		return;
	}

	// Bounce if we're already defined.
	if (window._teadsInject) {
		log('Injector already loaded, skipping.');
		return;
	}

	// Bounce if this is a FLEX site
	if (document.getElementById('flex_body')) {
		log('FLEX body found, skipping.');
		return;
	}

	var injector = {
		detectWindowSize: function detectWindowSize() {
			var width = 1000, height = 1000;
			
			if (typeof(window.innerWidth) === 'number') {
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

			injector.go({
				pid: PID,
				slot: '.wrapper-content',
				format: 'inboard',
				before: true,
				css: 'margin: auto !important; padding-top: 5px; padding-bottom: 5px;',
				size: {w: injector.detectWindowSize().w}
			});

		},

		inread: function inreadInjector(PID) {

			injector.go({
				pid: PID,
				slot: '.loop .post .entry-content p',
				filter: function() {
					var body = window.top.document.getElementsByTagName('body')[0];
					return body.className.indexOf('single-post') > -1;
				},
				format: 'inread',
				before: false,
				css: 'padding-bottom: 10px !important;'
			});

		},

		inject: function injectorInject(type, pid) {
			if (type && pid) {
				log('Received request for ' + type + ' with PID ' + pid);
				injector[type](pid);
			}
		},

		go: function injectorGo(options) {

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

	// Overload array to listen for future push events
	var Teadsarray = function() {};
	Teadsarray.prototype = [];
	Teadsarray.prototype.push = function() {
		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i].pid && arguments[i].format) {
				injector.inject(arguments[i].format, arguments[i].pid);
			}
		}
	};

	log('Loaded.');

	// Handle any existing requests
	if (window._teadsinjector && window._teadsinjector.length) {
		for (var i = 0; i < window._teadsinjector.length; i++) {
			if (window._teadsinjector[i].pid && window._teadsinjector[i].format) {
				injector.inject(window._teadsinjector[i].format, window._teadsinjector[i].pid);
			}
		}
	}

	// change variable to our custom listener
	window._teadsinjector = new Teadsarray();
	window._teadsInject = injector.inject;

	log('Listening for future requests.');
}(window.self));
} catch(e) {}