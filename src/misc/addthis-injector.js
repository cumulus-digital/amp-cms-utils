;(function($, window, undefined){

	var scriptName = 'ADDTHIS INJECTOR',
		nameSpace = 'addThisInjector',
		version = '0.6.11',

		// AddThis PubId to use
		addThisPubId = 'ra-55dc79597bae383e';

	var w = window,
		wt = w.top,
		ws = w.self;

	function log() {
		wt._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	if (wt.addthis) {
		$(function(){
			wt.addthis.update('share', 'url', ws.location.href);
			wt.addthis_share.url = ws.location.href;

			wt.addthis.update('share', 'title', ws.title);
			wt.addthis_share.title = ws.title;

			var desc = $('meta[property="og:description"]').attr('content');
			wt.addthis.update('share', 'description', desc);
			wt.addthis_share.description = desc;

			wt.addthis.init();
		});
		return;
	}

	log('Building addthis script.');
	wt.addthis_config = wt.addthis_config || {};
	wt.addthis_config.pubid = addThisPubId;
	var scr = wt.document.createElement('script');
	scr.src = '//s7.addthis.com/js/300/addthis_widget.js#async=1';
	scr.id = nameSpace + '-script';
	scr.async = true;
	wt.document.head.appendChild(scr);

	$(function(){
		wt.addthis.init();
	});

}(jQuery, window));