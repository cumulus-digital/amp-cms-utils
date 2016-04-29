;(function($, window, undefined){

	var scriptName = 'ADDTHIS INJECTOR',
		nameSpace = 'addThisInjector',
		version = '0.6.1',

		// AddThis PubId to use
		addThisPubId = 'ra-55dc79597bae383e';

	function log() {
		window.top._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	if (window.self.addthis && window.self.addthis_config && window.self.addthis_config.pubid && window.self.addthis_config.pubid !== addThisPubId) {
		log('AddThis already loaded by local page.');
		return;
	}

	var addthis_properties = [
		'addthis',
		'addthis_config',
		'addthis_share',
		'_adr',
		'_atc',
		'_atd',
		'_ate',
		'_atr',
		'_atw'
	];

	if (window.self !== window.top) {
		log('Not top window.');
		if (window.top.addthisDestroyer){
			window.top.addthisDestroyer();
		}
		for(var i in addthis_properties) {
			try {
				delete window.self[addthis_properties[i]];
				delete window.top[addthis_properties[i]];
				delete window[addthis_properties[i]];
			} catch(e) { log(e); }
		}
	} else {
		log('Loaded in top window.');
		window.top.addthisDestroyer = function(){
			log('Removing addthis from top window.');
			$('script[src*="addthis"]').remove();
			if (window.top.addthis) {
				window.top.addthis.layers(function(layer){
					log('Destroying addthis layer in top window.');
					layer.destroy();
					$('.addthis-smartlayers').remove();
				});
			}
		};
	}

	if (window.self.NO_ADDTHIS_HERE) {
		log('NO_ADDTHIS_HERE found, will not build.');
		return;
	}

	if (window.top._CMLS.isHomepage(window.self)) {
		log('Will not build on homepage, exiting.');
		return;
	}

	window.self.addthis_config = window.self.addthis_config || {};
	window.self.addthis_config.pubid = addThisPubId;

	var scr = window.self.document.createElement('script');
	scr.onload = function(){
		buildLayer();
	};
	scr.src = '//s7.addthis.com/js/300/addthis_widget.js#async=1';
	scr.id = nameSpace + '-script';
	scr.async = true;
	window.self.document.head.appendChild(scr);

	log('Injected.');

	function buildLayer(){
		log('Building layer.');
		if (window.self.addthis && window.self.addthis.layers) {
			window.self.addthis.layers({
				'share': {
					'position': 'left',
					'offset': { 'bottom': '100px' },
					'services' : 'facebook,twitter,tumblr,email,more'
				}
			}, function() {
				window.self.addthis.layers.refresh();
				log('Layer built.');
			});
		} else {
			log('Addthis not available!');
		}
	}

}(jQuery, window));