(function($, window, undefined){

	var scriptName = 'TEADS INJECTOR',
		nameSpace = 'teadsInjector',
		version = '0.7.3';

	// Only define once.
	if (window._CMLS[nameSpace]) {
		return;
	}

	function log() {
		if (window.top._CMLS) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	function TeadsInjector(){

		function _process(options){
			log(options);
		}


		// Create a fake array to overload push function
		var TeadsArray = function(){};
		TeadsArray.prototype = [];
		TeadsArray.prototype.push = function(){
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i].format && arguments[i].pid) {
					_process(
						arguments[i].format,
						arguments[i].pid
					);
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

	window._CMLS[nameSpace] = new TeadsInjector();

	log('Initialized.');

}(jQuery, window));