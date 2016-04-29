(function($, window, undefined){

	var scriptName = 'TEADS INJECTOR',
		nameSpace = 'teadsInjector',
		version = '0.7.9';

	function log() {
		if (window.top._CMLS) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	function TeadsInjector(){

		var teadsOptions = {
			inboard: {
				slot: '.wrapper-content,iframe[name="page_frame"] .wrapper-content',
				filter: function() {
					if (window.self.document.body.className.indexOf('home') > -1 || window._CMLS.forceTeadsInBoard === true) {
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
				slot: '.wrapper-content .column-1 .entry-content p',
				filter: function() {
					if (window.self.document.body.className.indexOf('single-feed_posts') > -1) {
						log('On a post page.');
						return true;
					}
					log('Not on a post page.');
					return false;
				},
				format: 'inread',
				before: false,
				css: 'padding-bottom: 10px !important;',
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
				window.self._ttf = window.self._ttf || [];
				window.self._ttf.push(requestOptions);

				$('#cmlsTeadsTag').remove();
				(function(d){
					var js, s = d.getElementsByTagName('script')[0];
					js = d.createElement('script'); js.async = true;
					js.id = 'cmlsTeadsTag';
					js.src = "http://cdn.teads.tv/js/all-v1.js";
					s.parentNode.insertBefore(js, s);
				})(window.self.document);

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
		if (window.self._teadsinjector && window.self._teadsinjector.length) {
			log('Found existing requests, processing.', window.self._teadsinjector);
			for (var i = 0; i < window.self._teadsinjector.length; i++) {
				_process(window.self._teadsinjector[i]);
			}
		}

		// Reassign our fake array for future requests
		window.self._teadsinjector = new TeadsArray();
		log('Listening for future requests.');

	}

	// Remove any existing teads junk
	if (window.teads) {
		delete window.teads;
	}
	if (window._ttf) {
		delete window._ttf;
	}
	if (window.top === window.self){
		window.top._CMLS.teadsRemover = function(){
			log('Removing Teads from top frame.');
			$('#cmlsTeadsTag,script[src^="http://cdn.teads"],iframe[src*="sync.teads.tv"],style[id^="tt-"]').remove();
			if (window.top._teadsinjector) {
				delete window.top._teadsinjector;
			}
			if (window.top._CMLS[nameSpace]) {
				delete window.top._CMLS[nameSpace];
			}
			if (window.top.teads) {
				delete window.top.teads;
			}
			if (window.top._ttf) {
				delete window.top._ttf;
			}
		};
	} else {
		window.top._CMLS.teadsRemover();
	}

	// Start our injector
	window.self._CMLS = window.self._CMLS || {};
	window.self._CMLS[nameSpace] = new TeadsInjector();

	log('Initialized.');

}(jQuery, window));