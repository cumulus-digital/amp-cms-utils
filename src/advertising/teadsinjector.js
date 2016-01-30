/**
 * Received Teads PIDs and injects Teads' scripting.
 *
 * local usage:
 * window._teadsinjector.push({
 *   pidd: '1234',
 *   format: 'inboard'
 * });
 */
;(function(window, undefined){

	var scriptName = 'TEADS INJECTOR',
		nameSpace = 'teadsInjector',
		version = '0.8',
		_CMLS = window._CMLS || {};

	if (_CMLS[nameSpace] || window.self.teads){
		return;
	}

	function log() {
		_CMLS.log(scriptName + ' v' + version, arguments);
	}

	function TeadsInjector(){
		var that = this,
			cache = {},
			TeadsArray = function() {};

		/**
		 * Process a request for Teads
		 * @param  {Object} requests  Must contain format and pid keys
		 * @return {void}
		 */
		this.process = function(requests) {
			if ( ! requests) {
				log('Request was empty.', requests);
				return;
			}
			// Convert to array if necessary
			if ( ! (requests.push && requests.pop)) {
				requests = [requests];
			}
			requests.forEach(function(req){
				if ( ! req.format || ! req.pid) {
					log('Invalid request.', req);
					return;
				}
				log('Received request', 'format: ' + req.format, 'PID: ' + req.pid);
				switch(req.format.toLowerCase()) {
					case 'inread':
						inread(req.pid);
						break;
					case 'inboard':
						inboard(req.pid);
						break;
				}
			});
		};

		/**
		 * Discover the window size, with a maximum width of 1020px
		 * @return {Object} w: width, h: height
		 */
		function getWindowSize() {
			var maxW = 1020,
				dE = document.documentElement || { clientWidth: 0, clientHeight: 0 },
				w = Math.max(dE.clientWidth, window.innerWidth || 0),
				h = Math.max(dE.clientHeight, window.innerHeight || 0);

			if (w > maxW) {
				w = maxW;
			}

			return { w: w, h: h };
		}

		/**
		 * Instructs injector to render an inboard ad
		 * @param  {Number} pid Teads PID
		 * @return {void}
		 */
		function inboard(pid) {
			var windowSize = getWindowSize();
			inject({
				pid: pid,
				slot: '.wrapper-content',
				filter: function(){
					return window.document.body.className.indexOf('home') > -1 || _CMLS.forceTeadsInBoard === true;
				},
				format: 'inboard',
				before: true,
				css: 'margin: auto !important; padding-top: 5px; padding-bottom: 5px; max-width: 1020px',
				size: { w: windowSize.w }
			});
		}

		/**
		 * Instructs injector to render an inread ad
		 * @param  {Number} pid Teads PID
		 * @return {void}
		 */
		function inread(pid) {
			inject({
				pid: pid,
				slot: '.wrapper-content .column-1 .entry-content p',
				filter: function(){
					return window.document.body.className.indexOf('single-feed_posts') > -1;
				},
				format: 'inread',
				before: false,
				css: 'padding-bottom: 10px !important;'
			});
		}

		/**
		 * Removes any cached requests from existing _ttf requests
		 * @return {void}
		 */
		function refreshCache() {
			log('Refreshing cache, reinserting PID requests.');
			cache.forEach(function(c) {
				// remove cached pids from ttf
				for (var i = 0; i < window.self._ttf.length; i++) {
					if (window.self._ttf[i].pid === c.pid) {
						window.self._ttf[i].splice(i,1);
					}
				}
				c.launched = false;
				inject(c);
			});
		}

		/**
		 * Remove any existing teads scripting and inject teads' @description
		 * @return {void}
		 */
		function insertTeadsScript() {
			window.self._ttf = undefined;
			window.parent._ttf = undefined;
			var existing = [
				window.self.document.getElementById('cmlsTeadsScript'),
				window.parent.document.getElementById('cmlsTeadsScript')
			];
			for(var i = 0; i < existing.length; i++) {
				if (existing[i]) {
					existing[i].parentNode.removeChild(existing[i]);
				}
			}
			(function(d){
				var js, s = d.getElementsByTagName('script')[0];
				js = d.createElement('script'); js.async = true;
				js.id = 'cmlsTeadsScript';
				js.src = "http://cdn.teads.tv/js/all-v1.js";
				s.parentNode.insertBefore(js, s);
			})(window.self.document);
		}

		/**
		 * Handles injection of teads options
		 * @param  {Object} options Teads ad parameters
		 * @return {void}
		 */
		function inject(options) {
			if ( ! options || ! options.pid || ! options.slot || ! options.format) {
				log('Invalid request.', options);
				return;
			}

			options.components = options.components || { skip: { delay: 0 }};
			options.lang = options.lang || 'en';
			options.filter = options.filter || function() { return true; };
			options.minSlot = options.minSlot || 0;
			options.before = options.before || false;
			options.BTF = options.BTF || false;
			options.css = options.css || 'margin: auto !important;';

			log('Injecting!', options);
			window.self._ttf = window.self._ttf || [];
			window.self._ttf.push(options);

			insertTeadsScript();

			cache[options.pid] = options;
		}

		// Handle any existing requests
		that.process(window.self._teadsinjector);

		// Handle future requests
		TeadsArray.prototype = [];
		TeadsArray.prototype.push = function(){
			var args = [].prototype.slice.call(arguments);
			that.process(args);
		};
		window.self._teadsinjector = new TeadsArray();

		// With Triton's player, listen for pageChange events and reinject
		var player = _CMLS.whichPlayer();
		if (
			player && player.type &&
			player.type === _CMLS.const.PLAYER_TRITON &&
			window.History && window.History.Adapter
		) {
			log('Binding to pageChange event.');
			window.History.Adapter.bind(window, 'pageChange', function(){
				window.document.addEventListener("DOMContentLoaded", function(){
					refreshCache();
				});
			});
		}
	}

	_CMLS[nameSpace] = new TeadsInjector();


}(window));