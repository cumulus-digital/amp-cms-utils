/**
 * Emit GTM events when a promo reel item is clicked
 */
(function($, w, undefined){

	var scriptName = 'GTM PROMO REEL TRACKING',
		nameSpace = 'GTMPromoReelTracker',
		version = '0.1';

	window._CMLS[nameSpace] = true;

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	function fireEvent(ev, url) {
		try {
			log('Event fired: ' + ev, url);
			sharedContainerDataLayer.push({'event': ev, 'promoReelClickURL': url});
			corpDataLayer.push({'event': ev, 'promoReelClickURL': url});
		} catch(e){}
	}

	$(function(){
		var prItems = $('.home .sliderItem');
		prItems.on('click', function(){
			var $this = $(this),
				url = $this.attr('data-href');
			if ( ! url || url.length < 1) {
				url = $this.attr('onclick').replace(/window\.open=\(\'([^\']+).*/, "$1").replace(/window\.location=\'([^\']+).*/, "$1");
			}
			fireEvent('promoreel-click', url);
		});
	});

}(jQuery, window.self));