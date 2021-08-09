;(function($, window, undefined){

	var scriptName = 'ADDTHIS INJECTOR',
		nameSpace = 'addThisInjector',
		version = '0.6.17',

		// AddThis PubId to use
		addThisPubId = 'ra-55dc79597bae383e';

	function log() {
		if (window.top._CMLS && window.top._CMLS.logger) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	if (window.self.addthis && window.self.addthis_config && window.self.addthis_config.pubid && window.self.addthis_config.pubid !== addThisPubId) {
		log('AddThis already loaded by local page.');
		return;
	}

	/*
	var addthis_properties = [
		'addthis',
		'addthis_close',
		'addthis_conf',
		'addthis_config',
		'addthis_exclude',
		'addthis_open',
		'addthis_options',
		'addthis_options_default',
		'addthis_options_rank',
		'addthis_sendto',
		'addthis_share',
		'addthis_use_personalization',
		'_adr',
		'_atc',
		'_atd',
		'_ate',
		'_atr',
		'_atw'
	];
	*/

	/*
	if (window.self !== window.top) {
		log('Not top window.');
		if (window.top.addthisDestroyer){
			window.top.addthisDestroyer();
		}
		$(window).on('unload', function(){
			log('Removing AddThis layers.');
			$('.addthis-smartlayers').remove();
		});
	} else {
		log('Loaded in top window.');
		window.top.addthisDestroyer = function(){
			log('Removing addthis from top window.');
			$('script[src*="addthis"]').remove();
			if (window.top.addthisLayerReference) {
				log('Instructing addthis to destroy itself.');
				try{
					window.top.addthisLayerReference.destroy();
				} catch(e) {}
				delete window.top.addthisLayerReference;
				$('.addthis-smartlayers').remove();
			} else {
				log('No addthis object in top window.');
			}
		};
	}
	*/

	if (window.self.NO_ADDTHIS_HERE) {
		log('NO_ADDTHIS_HERE found, will not build.');
		return;
	}

	if (
		window.top._CMLS &&
		window.top._CMLS.hasOwnProperty('isHomepage') &&
		window.top._CMLS.isHomepage(window.self)
	) {
		log('Will not build on homepage, exiting.');
		return;
	}

	window.self.addthis_config = window.self.addthis_config || {};
	window.self.addthis_config.pubid = addThisPubId;

	log('Building addthis script.');
	var scr = window.self.document.createElement('script');
	scr.onload = function(){
		//buildLayer();
	};
	scr.src = '//s7.addthis.com/js/300/addthis_widget.js#domready=1&amp;pubid=' + addThisPubId;
	scr.id = nameSpace + '-script';
	scr.async = true;
	window.self.document.body.appendChild(scr);

	log('Injected.');

	/*
	function buildLayer(){
		log('Building layer.');
		if (window.self.addthis && window.self.addthis.layers) {
			window.self.addthis.layers({
				'share': {
					'position': 'left',
					'offset': { 'bottom': '100px' },
					'services' : 'facebook,twitter,tumblr,email,more'
				}
			}, function(layer) {
				window.self.addthis.layers.refresh();
				window.top.addthisLayerReference = layer;
				log('Layer built.');
			});
		} else {
			log('Addthis not available!');
		}
	}
	*/
	

}(jQuery, window.self));