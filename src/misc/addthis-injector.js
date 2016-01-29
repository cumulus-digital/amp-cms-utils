/**
 * Loads AddThis and handles re-initialization when pages are loaded
 * through Triton's player.
 */
;(function(window, undefined) {
	var scriptName = 'ADDTHIS INJECTOR',
		nameSpace = 'addThisInjector',
		version = '0.5',

		// AddThis PubId to use
		addThisPubId = 'ra-55dc79597bae383e';

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	if (window.addthis) {
		log('AddThis already loaded by local page.');
		return;
	}

	if (window.parent !== window.top) {
		log('Not top window, destroying AddThis in parent window');
		if (window.parent.addthis) {
			// destroy parent layer
			window.parent._CMLS[nameSpace].destroyLayer();
			window.parent._CMLS[nameSpace] = undefined;

			// clear all addthis variables
			window.parent.addthis = 
			window.parent.addthis_config = 
			window.parent.addthis_share = 
			window.parent._adr =
			window.parent._atc =
			window.parent._atd =
			window.parent._ate =
			window.parent._atr =
			window.parent._atw = undefined;

			// Remove all addthis script tags from parent window
			var scr = window.parent.querySelectorAll('script[src*="addthis"');
			if (scr && scr.length) {
				for (var i in scr) {
					if (scr[i].parentNode) {
						scr[i].parentNode.removeChild(scr[i]);
					}
				}
			}
		}
	}

	window._CMLS[nameSpace] = {

		inject: function inject() {
			log('Injecting.');

			window.addthis_config = window.addthis_config || {};
			window.addthis_config.pubid = addThisPubId;

			var scr = window.document.createElement('script');
			scr.onload = function() {
				if ( ! window._CMLS[nameSpace].active) {
					window._CMLS[nameSpace].buildLayer();
					return;
				}
				log('Already active.');
			};
			scr.src = '//s7.addthis.com/js/300/addthis_widget.js#async=1';
			scr.id = nameSpace + 'Script';
			scr.async = false;
			window.document.head.appendChild(scr);

			log('Injected.');
		},

		buildLayer: function buildLayer() {
			if (window.NO_ADDTHIS_HERE) {
				log('NO_ADDTHIS_HERE found in window object, will not build.');
				return;
			}
			if (window._CMLS.isHomepage()) {
				log('Will not build layer on homepage.');
				return;
			}
			log('Building layer.');
			if (window.addthis && window.addthis.layers) {
				window.addthis.layers({
					'share': {
						'position': 'left',
						'offset': { 'bottom': '100px' },
						'services' : 'facebook,twitter,tumblr,email,more'
					}
				}, function(layer) {
					window._CMLS[nameSpace].layer = layer;
					window.addthis.layers.refresh();
					log('Layer built.');
				});
				window._CMLS[nameSpace].active = true;
			} else {
				log('AddThis not available!');
			}
		},

		destroyLayer: function destroyLayer() {
			log('Destroying layer.');
			if (window.addthis && window._CMLS[nameSpace].active) {
				window.addthis.layers(function(layer) {
					layer.destroy();
					window._CMLS[nameSpace].active = false;
				});
			}
		},

		init: function init() {
			log('Initializing.');

			// Reset on navigation with Triton player.
			if (window.History && window.History.Adapter) {
				window.History.Adapter.bind(window, 'statechange', window._CMLS[nameSpace].destroyLayer);
				window.History.Adapter.bind(window, 'pageChange', window._CMLS[nameSpace].buildLayer);
			}

			this.inject();

			log('Initialized!');
		}

	};

	window._CMLS[nameSpace].init();

}(window));