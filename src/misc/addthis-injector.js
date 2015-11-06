/**
 * Loads AddThis and handles re-initialization with the Triton Player
 */
(function($, window, undefined){

	var scriptName = 'ADDTHIS INJECTOR',
		nameSpace = 'addThisInjector',
		version = '0.3',

		// AddThis PubId to use
		addThisPubId = 'ra-55dc79597bae383e';

	// Don't overwrite existing addthis code
	if (window.addthis) {
		return;
	}

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	window._CMLS[nameSpace] = {

		addThisLayer: null,

		/**
		 * Injects and initializes AddThis scripting
		 * @return {void}
		 */
		inject: function inject() {
			log('Injecting.');

			window.addthis_config = {
				pubid: addThisPubId
			};

			var atscr = window.document.createElement('script');
			atscr.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55dc79597bae383e&async=1';
			atscr.async = true;
			atscr.id = nameSpace + 'Script';
			window.document.body.appendChild(atscr);

			log('Injected.');
		},

		/**
		 * Hide AddThis layer
		 * @param  {Boolean} transitions Use transition class
		 * @return {void}
		 */
		hide: function hide(transitions) {
			$('.atss-left').addClass(
				transitions ? 'slideOutLeft' : 'at4-hide'
			);
		},

		/**
		 * Show AddThis layer
		 * @param  {Boolean} transitions Use transition class
		 * @return {void}
		 */
		show: function show(transitions) {
			$('.atss-left').removeClass(
				transitions ? 'slideOutLeft' : 'at4-hide'
			);
		},

		/**
		 * Remove and reset everything about AddThis
		 * @param {Boolean} reinject True will force AddThis to be re-injected
		 * @return {void}
		 */
		reset: function reset(reinject) {
			if (window.addthis) {
				log('Resetting.');

				var transitions = $('html').hasClass('csstransitions');

				if (reinject) {
					window.addthis = null;
					window._adr = null;
					window._atc = null;
					window._atd = null;
					window._ate = null;
					window._atw = null;
					window.addthis_share = {};
					this.inject();
				} else {
					window.addthis.toolbox();
					window.addthis.layers.refresh();
					window.addthis.update('share', 'url', window.location.href);
					window.addthis.update('share', 'title', window.document.title);
				}

				if (window._CMLS.isHomepage() || ! reinject) {
					this.hide(transitions);
				} else {
					this.show(transitions);
				}

			}
		},

		init: function init() {
			var that = this;

			// Reset on navigation
			$(window).on('statechange pageChange', function(e) {
				log('Caught navigation change.', e);
				that.reset(e.type.toLowerCase() === 'pagechange');
			});

			this.inject();

			log('Initialized!');
		}
	};

	$(function() {
		window._CMLS[nameSpace].init();
	});
}(jQuery, window));