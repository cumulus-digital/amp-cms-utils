/**
 * Googletag interface
 */
(function(window, $, undefined) {
	
	var scriptName = 'DFP INTERFACE',
		//nameSpace = 'InterfaceDFP',
		parentNameSpace = 'adTagDetection',
		version = '0.1.2';

	window._CMLS = window._CMLS || {};

	window._CMLS[parentNameSpace] = window._CMLS[parentNameSpace] || {};
	window._CMLS[parentNameSpace].registeredDetectors = window._CMLS[parentNameSpace].registeredDetectors || [];
	//window._CMLS[parentNameSpace][nameSpace] = window._CMLS[parentNameSpace][nameSpace] || {};

	function log() {
		if(window.top._CMLS && window.top._CMLS.hasOwnProperty('logger')) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	var DFP = new window._CMLS[parentNameSpace].stubInterface();

	DFP.identity = 'dfp';
	DFP.detectTag = function(){
		if (window.googletag) {
			log('Googletag detected.');
			return true;
		}
	};

	DFP.rawInterface = function() {
		return window.googletag;
	};

	DFP.addListener = function(e, func) {
		DFP.queue(function(){
			DFP.pubads().addEventListener(e, func);
		});
	};

	DFP.removeListener = function(e, func) {
		return DFP.pubads().removeEventListener(e, func);
	};

	DFP.setTargeting = function(key, value) {
		return DFP.pubads().setTargeting(key, value);
	};

	DFP.defineSlot = function(slotOptions, collapse, targeting, initialize) {
		var slot = DFP.rawInterface().defineSlot.apply(null, slotOptions);
		if (collapse) {
			slot = slot.setCollapseEmptyDiv(true);
		}
		if (Array.isArray(targeting)) {
			targeting.forEach(function(target) {
				for (var k in target) {
					if (target.hasOwnProperty(k)) {
						slot = slot.setTargeting(k, target[k]);
					}
				}
			});
		} else if (typeof targeting === "object") {
			for (var k in targeting) {
				if (targeting.hasOwnProperty(k)) {
					slot = slot.setTargeting(k, targeting[k]);
				}
			}
		}
		if (initialize) {
			slot = slot.addService(DFP.pubads());
		}
		return slot;
	};

	window._CMLS[parentNameSpace].registeredDetectors.push(DFP);

}(window.self, jQuery));