/**
 * Googletag interface
 */
(function(window, $, undefined) {
	
	var scriptName = 'DFP INTERFACE',
		//nameSpace = 'InterfaceDFP',
		parentNameSpace = 'adTagDetection',
		version = '0.1.1';

	window._CMLS = window._CMLS || {};

	window._CMLS[parentNameSpace] = window._CMLS[parentNameSpace] || {};
	window._CMLS[parentNameSpace].registeredDetectors = window._CMLS[parentNameSpace].registeredDetectors || [];
	//window._CMLS[parentNameSpace][nameSpace] = window._CMLS[parentNameSpace][nameSpace] || {};

	function log() {
		if(window.top._CMLS && window.top._CMLS.hasOwnProperty('logger')) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	function DFP() {

		this.identity = 'dfp';
		var me = this;

		this.detectTag = function() {
			if (window.googletag) {
				log('Googletag detected.');
				return true;
			}
		};

		// Return the raw DFP interface (googletag)
		this.rawInterface = function() {
			return window.googletag;
		};

		// Queue a command
		this.queue = function(callback) {
			me.rawInterface().cmd.push(callback);
		};

		// Return the pubads interface
		this.pubads = function() {
			return me.rawInterface().pubads();
		};

		// Adds a listener
		this.addListener = function(e, func) {
			me.rawInterface().cmd.push(function(){
				me.pubads().addEventListener(e, func);
			});
		};

		// Remove a listener
		this.removeListener = function(e, func) {
			return me.pubads().removeEventListener(e, func);
		};

		// Refresh ads
		this.refreshAds = function() {
			return me.pubads().refresh();
		};

		// Set site-level targeting
		this.setTargeting = function(key, value) {
			return me.pubads().setTargeting(key, value);
		};

		// Create a new slot
		this.defineSlot = function(slotOptions, collapse, targeting, initialize) {
			var slot = me.defineSlot.apply(null, slotOptions);
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
				slot = slot.addService(me.pubads());
			}
			return slot;
		};

		// Render an ad unit in a given slot ID
		this.display = function(div) {
			me.rawInterface().cmd.push(function(){
				me.rawInterface().display(div);
			});
		};

		return this;

	}

	window._CMLS[parentNameSpace].registeredDetectors.push(new DFP());

}(window.self, jQuery));