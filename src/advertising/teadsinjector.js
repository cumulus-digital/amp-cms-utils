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
(function($, window, undefined) {
	
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

	function TeadsInjector() {
		var cache = {};

		function _process(options) {
			if (options.format && options.pid) {
				log('Received request for ' + options.format + ' with PID ' + options.pid);
				switch(options.format.toLowerCase()) {
					case 'inread':
						inread(options.pid);
						break;
					case 'inboard':
						inboard(options.pid);
						break;
				}
			} else {
				log('Invalid request. No pid or format given.', options);
			}
		}
		this.process = _process;

		function getWindowSize() {
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
		}

		function inboard(pid) {
			var windowSize = getWindowSize();
			inject({
				pid: pid,
				slot: '.wrapper-content.',
				filter: function() {
					return window.document.body.className.indexOf('home') > -1;
				},
				format: 'inboard',
				before: true,
				css: 'margin: auto !important; padding-top: 5px; padding-bottom: 5px; max-width: 1000px',
				size: { w: windowSize.w }
			});
		}

		function inread(pid) {
			inject({
				pid: pid,
				slot: '.wrapper-content .column-1 .entry-content p',
				filter: function() {
					return window.document.body.className.indexOf('single-feed_posts') > -1;
				},
				format: 'inread',
				before: false,
				css: 'padding-bottom: 10px !important;'
			});
		}

		function _refreshCache() {
			log('Refreshing cache, re-inserting PID requests.');
			for (var j in cache) {
				if (cache.hasOwnProperty(j)) {
					for (var i = 0; i < window._ttf.length; i++) {
						if (window._ttf[i].pid === cache[j].pid) {
							window._ttf.splice(i,1);
						}
					}
					inject(cache[j]);
				}
			}
		}
		this.refreshCache = _refreshCache;

		function insertTeadsScript() {
			if ( ! window.document.getElementById('cmlsTeadsTag')) {
				(function(d){
					var js, s = d.getElementsByTagName('script')[0];
					js = d.createElement('script'); js.async = true;
					js.id = 'cmlsTeadsTag';
					js.src = "http://cdn.teads.tv/js/all-v1.js";
					s.parentNode.insertBefore(js, s);
				})(window.document);
			}
		}

		function inject(options) {
			if ( ! options.pid || ! options.slot || ! options.format) {
				log('Invalid request. No pid, slot, or format given.', options);
				return false;
			}

			options.components = options.components || { skip: { delay: 0 }};
			options.lang = options.lang || 'en';
			options.filter = options.filter || function() { return true; }; 
			options.minSlot = options.minSlot || 0;
			options.before = options.before || false;
			options.BTF = options.BTF || false;
			options.css = options.css || 'margin: auto !important;';

			log('Injecting', options);
			window._ttf = window._ttf || [];
			window._ttf.push(options);

			insertTeadsScript();

			cache[options.pid] = options;
		}


		// Setting up!
		
		// Create a fake array to overload push
		var TeadsArray = function() {};
		TeadsArray.prototype = [];
		TeadsArray.prototype.push = function() {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i].format && arguments[i].pid) {
					_process(
						arguments[i].format,
						arguments[i].pid
					);
				}
			}
		};

		// Handle any existing requests before we were loaded
		if (window._teadsinjector && window._teadsinjector.length) {
			for (var i = 0; i < window._teadsinjector.length; i++) {
				_process(window._teadsinjector[i]);
			}
		}

		window._teadsinjector = new TeadsArray();

		log('Listening for future requests.');

	}

	window._CMLS[nameSpace] = new TeadsInjector();

	// listen for pageChange events
	var playerType = window._CMLS.whichPlayer();
	if (
		playerType && playerType.type &&
		playerType.type === window._CMLS.const.PLAYER_TRITON &&
		window.History && window.History.Adapter
	) {
		log('Binding refreshCache to pageChange event.');
		window.History.Adapter.bind(window, 'pageChange', function() {
			$(window._CMLS[nameSpace].refreshCache);
		});
	}

}(jQuery, window));