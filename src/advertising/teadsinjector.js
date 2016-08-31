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
		version = '0.7.16';

	function log() {
		if (window.top._CMLS) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	function isHomepage(){
		if (window.document.querySelector('body.home')) {
			log('On Homepage.');
			return true;
		}
		log('Not on Homepage.');
		return false;
	}

	function TeadsInjector(){

		var teadsOptions = {
			inboard: {
				slot: function(){
					return window.document.querySelector('.wrapper-content');
				},
				filter: function(){
					if (isHomepage() || window._CMLS.forceTeadsInBoard === true) {
						return true;
					}
					return false;
				},
				format: 'inboard',
				before: true,
				css: 'margin: auto !important; padding-top: 5px; padding-bottom: 5px; max-width: 1020px;',
				size: { w: 1020 },
				launched: false,
				components: { skip: { delay: 0 }},
				lang: 'en',
				minSlot: 0,
				BTF: false
			},
			inread: {
				slot: function(){
					var s = window.document.querySelectorAll('.wrapper-content .column-1 .entry-content > p');
					return s[2] || s[s.length];
				},
				filter: ( ! isHomepage()),
				before: false,
				css: 'margin: 10px auto !important; max-width: 90%;',
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
				log('Received request for ' + options.format.toUpperCase() + ' with PID ' + options.pid, options);
				var requestOptions = $.extend({}, teadsOptions[options.format.toLowerCase()], options);

				log('Injecting', requestOptions);

				if (typeof requestOptions.slot === "function") {
					requestOptions.slot = requestOptions.slot();
				}

				window._ttf = window._ttf || [];
				window._ttf.push(requestOptions);

				$('script[src*="teads.tv"],iframe[src*="teads.tv"]').remove();
				(function (d) {
				        var js, s = d.getElementsByTagName('script')[0];
				        js = d.createElement('script');
				        js.async = true;
				        js.id = 'cmlsTeadsTag';
				        js.src = '//cdn.teads.tv/media/format.js';
				        s.parentNode.insertBefore(js, s);
				})(window.document);
			} catch (e) { log('Failed', e); }
		}
		this.process = _process;

		log('Initializing _teadsinjector array handlers.');

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

	$('script[src*="teads.tv"],iframe[src*="teads.tv"]').remove();

	// Start our injector
	window._CMLS = window._CMLS || {};
	window._CMLS[nameSpace] = new TeadsInjector();

	log('Initialized.');

}(jQuery, window.self));