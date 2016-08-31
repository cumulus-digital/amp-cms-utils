/**
 * Receives Teads PIDs and injects Teads' scripting,
 * re-injects PIDs on pages loaded through Triton's player.
 *
 * Local usage:
 * 	window._teadsinjector.push({
 * 		pid: '1234',
 * 		format: 'inboard'
 * 	});
 */
(function($, window, undefined){

	var scriptName = 'TEADS INJECTOR',
		nameSpace = 'teadsInjector',
		version = '0.7.14';

	function log() {
		if (window.top._CMLS) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	function TeadsInjector(){

		var teadsOptions = {
			inboard: {
				slot: function(){
					return '.wrapper-content';
				},
				filter: function() {
					if (window.document.body.className.indexOf('home') > -1 || window._CMLS.forceTeadsInBoard === true) {
						log('On homepage.');
						return true;
					}
					log('Not on homepage.');
					return false;
				},
				format: 'inboard',
				before: true,
				css: 'margin: auto !important; padding-top: 5px; padding-bottom: 5px; max-width: 1020px',
				size: { w: 1020 },
				launched: false,
				components: { skip: { delay: 0 }},
				lang: 'en',
				minSlot: 0,
				BTF: false,
			},
			inread: {
				slot: function(){
					var s = window.document.querySelectorAll('.wrapper-content .column-1 .entry-content > p');
					s = s[2] || s[s.length];
					return s;
				},
				filter: function() {
					if (window.document.body.className.indexOf('home') > -1 || window._CMLS.forceTeadsInBoard === true) {
						log('On Homepage.');
						return false;
					}
					log('Not on Homepage.');
					return true;
				},
				format: 'inread',
				before: false,
				css: 'margin: 10px auto !important; max-width: 90% !important;',
				launched: false,
				components: { skip: { delay: 0 }},
				lang: 'en',
				minSlot: 0,
				BTF: false
			}
		};

		function _process(options){
			try {
				if ( ! options || ! options.pid || ! options.format) {
					throw {message: 'Invalid request, no PID or format given.', data: options};
				}
				log('Received request for ' + options.format + ' with PID ' + options.pid, options);
				var requestOptions = $.extend({}, teadsOptions[options.format.toLowerCase()], options);
				
				log('Injecting', requestOptions);
				if (typeof requestOptions.slot === "function") {
					requestOptions.slot = requestOptions.slot();
				}
				window._ttf = window._ttf || [];
				window._ttf.push(requestOptions);

				$('#cmlsTeadsTag').remove();
				(function(d){
					var js, s = d.getElementsByTagName('script')[0];
					js = d.createElement('script'); js.async = true;
					js.id = 'cmlsTeadsTag';
					js.src = "http://cdn.teads.tv/js/all-v1.js";
					s.parentNode.insertBefore(js, s);
				})(window.document);

			} catch(e){
				log('Failed to process.', e);
			}
		}
		this.process = _process;


		// Create a fake array to overload push function
		var TeadsArray = function(){};
		TeadsArray.prototype = [];
		TeadsArray.prototype.push = function(){
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i].format && arguments[i].pid) {
					$(_process(
						arguments[i].format,
						arguments[i].pid
					));
				}
			}
		};

		// Handle any existing requests that came before library loaded
		if (window._teadsinjector && window._teadsinjector.length) {
			log('Found existing requests, processing.', window._teadsinjector);
			for (var i = 0; i < window._teadsinjector.length; i++) {
				_process(window._teadsinjector[i]);
			}
		}

		// Reassign our fake array for future requests
		window._teadsinjector = new TeadsArray();
		log('Listening for future requests.');

	}

	// Remove any existing teads junk
	if (window.teads) {
		delete window.teads;
	}
	if (window._ttf) {
		delete window._ttf;
	}
	if (window.top === window){
		window.top._CMLS.teadsRemover = function(){
			log('Removing Teads from top frame.');
			$('#cmlsTeadsTag,script[src^="http://cdn.teads"],iframe[src*="sync.teads.tv"],style[id^="tt-"]').remove();
			Object.keys(window.top).forEach(function(key){
				if (key.indexOf('teads') > -1 || key.indexOf('_ttf') > -1) {
					delete window.top[key];
				}
			});
			if (window.top._CMLS[nameSpace]) {
				delete window.top._CMLS[nameSpace];
			}
		};
	} else {
		window.top._CMLS.teadsRemover();
	}

	// Start our injector
	window._CMLS = window._CMLS || {};
	window._CMLS[nameSpace] = new TeadsInjector();

	log('Initialized.');

}(jQuery, window.self));