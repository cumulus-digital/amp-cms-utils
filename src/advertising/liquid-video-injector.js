/**
 * Receives requests to inject Liquid Video ads inside post content.
 *
 * To use in DFP, set creative type to custom HTML.
 * DO NOT USE SAFE FRAME.
 * With this content:
 *
 * <script>
 *   try {
 * 	   window.parent.CMLSinjectLiquidAd({
 *       pid: 5,
 *       sid: 123456,
 *       playerContainerId: 'liquidPlayerContainer'
 *     });
 *   } catch() {}
 * </script>
 *
 * Replace the values for pid and sid with the station's own values.
 * playerContainerId is optional and will be the id attribute of the
 * injected container for the video.
 */

(function($, window, undefined) {

	var scriptName = 'LIQUID INJECTOR',
		//nameSpace = 'liquidInjector',
		version = '0.4',
		w = window;

	function log() {
		if (w.top._CMLS && w.top._CMLS.logger) {
			w.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	log('Initializing Liquid Video Injector');
	function processLiquid(options) {
		log('Received request!', options);

		if (!options.hasOwnProperty('playerContainerId')) {
			options.playerContainerId = 'liquidPlayerContainer';
		}

		// Remove any existing placement
		var placement = $('#' + options.playerContainerId);
		if (placement.length) {
			placement.remove();
		}

		// Create placement
		var article = $('.wrapper-content > .grid-container > .row-1 > .column-1 article:first'),
			ps = article.find('p');

		// don't inject ad if there are less than 2 paragraphs.
		if (ps.length < 2) {
			log('Not enough paragraphs, ejecting.');
			return;
		}

		var p = ps.eq(1);

		p.after('<div id="' + options.playerContainerId + '" style="margin-bottom: 1em"></div>');

		log('Placement div injected, running Liquid code');

		// LIQUID CODE FOLLOWS
		var lkqdSettings = {
			pid: options.pid,
			sid: options.sid,
			playerContainerId: options.playerContainerId,
			playerId: '',
			playerWidth: '',
			playerHeight: '',
			execution: 'outstream',
			placement: 'incontent',
			playInitiation: 'auto',
			volume: 100,
			trackImp: '',
			trackClick: '',
			custom1: '',
			custom2: '',
			custom3: '',
			pubMacros: '',
			dfp: false,
			lkqdId: new Date().getTime().toString() + Math.round(Math.random()*1000000000).toString()
		};

		var lkqdVPAID;
		var creativeData = '';
		var environmentVars = { slot: w.document.getElementById(lkqdSettings.playerContainerId), videoSlot: w.document.getElementById(lkqdSettings.playerId), videoSlotCanAutoPlay: true, lkqdSettings: lkqdSettings };

		log(environmentVars);

		function onVPAIDLoad()
		{
			lkqdVPAID.subscribe(function() { lkqdVPAID.startAd(); }, 'AdLoaded');
			lkqdVPAID.subscribe(function() { lkqdVPAID.pauseAd(); }, 'AdNotViewable');
			lkqdVPAID.subscribe(function() { lkqdVPAID.resumeAd(); }, 'AdViewable');
		}

		var vpaidFrame = w.document.createElement('iframe');
		vpaidFrame.id = lkqdSettings.lkqdId;
		vpaidFrame.name = lkqdSettings.lkqdId;
		vpaidFrame.style.display = 'none';
		var vpaidFrameLoaded = function() {
			vpaidFrame.contentWindow.addEventListener('lkqdFormatsLoad', function() {
				lkqdVPAID = vpaidFrame.contentWindow.getVPAIDAd();
				onVPAIDLoad();
				lkqdVPAID.handshakeVersion('2.0');
				lkqdVPAID.initAd(lkqdSettings.playerWidth, lkqdSettings.playerHeight, 'normal', 600, creativeData, environmentVars);
			});
			var vpaidLoader = vpaidFrame.contentWindow.document.createElement('script');
			vpaidLoader.setAttribute('async','async');
			vpaidLoader.src = 'https://ad.lkqd.net/vpaid/formats.js?pid=' + options.pid + '&sid=' + options.sid;
			vpaidFrame.contentWindow.document.body.appendChild(vpaidLoader);
		};
		vpaidFrame.onload = vpaidFrameLoaded;
		vpaidFrame.onerror = vpaidFrameLoaded;
		w.document.documentElement.appendChild(vpaidFrame);

	}

	var LiquidInjectorArray = function(){};
	LiquidInjectorArray.prototype = [];
	LiquidInjectorArray.prototype.push = processLiquid;

	log('Initialized, use CMLSinjectLiquidAd.push({ pid: #, sid: # }) to inject.');

	// Process existing requests
	if (w.CMLSinjectLiquidAd && w.CMLSinjectLiquidAd.length) {
		for(var i = 0; i < w.CMLSinjectLiquidAd.length; i++) {
			processLiquid(w.CMLSinjectLiquidAd[i]);
		}
	}

	w.CMLSinjectLiquidAd = new LiquidInjectorArray();
	log('Listening for future requests.');

}(jQuery, window.self));