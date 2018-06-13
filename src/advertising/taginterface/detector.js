/**
 * Adtag Interface Detection
 * Detects and uses the appropriate ad tag service based on availability.
 */
(function(window, $, undefined) {
	
	var scriptName = 'ADTAG DETECTION',
		nameSpace = 'adTagDetection',
		version = '0.1.1';

	window._CMLS = window._CMLS || {};

	window._CMLS[nameSpace] = window._CMLS[nameSpace] || {};

	// Detectors must register themselves
	window._CMLS[nameSpace].registeredDetectors = window._CMLS[nameSpace].registeredDetectors || [];

	// Empty stub interface
	/* jshint ignore:start */
	var StubInterface = function() {
		var scriptName = 'STUB INTERFACE',
			nameSpace = 'InterfaceSTUB',
			parentNameSpace = 'adTagDetection',
			version = 'x';

		this.identity = 'STUB';
		this.detectTag = function() {};

		this.queue = function(callback) {};

		this.addListener = function(e, func) {};
		this.removeListener = function(e, func) {};
		this.pubads = function() {};
		this.refreshAds = function() {};
		this.setTargeting = function(key, value) {};

		/**
		 * Define a slot and optionally apply collapsing, targeting, and initialization
		 * @param  {array}        slotOptions  Options for defineSlot. Path, sizes, div ID
		 * @param  {boolean}      collapse     True to apply collapseEmptyDiv
		 * @param  {array|object} targeting    Define targeting for slot. Array of {key: value} objects.
		 * @param  {boolean}      initialize   True to add pubads service and initialize slot
		 * @return {object}                    Returns the slot
		 */
		this.defineSlot = function(slotOptions, collapse, targeting, initialize) {};

		this.display = function(div) {};
		this.rawInterface = function() {};

		return this;
	};
	window._CMLS.adTag = new StubInterface();
	/* jshint ignore:end */

	var detectionLoop, detectionTimes;

	function log() {
		if(window.top._CMLS && window.top._CMLS.hasOwnProperty('logger')) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	function detectTag() {
		if (window._CMLS[nameSpace].registeredDetectors) {
			log('Running registered detectors.', window._CMLS[nameSpace].registeredDetectors);
			window._CMLS[nameSpace].registeredDetectors.forEach(function(interface) {
				if ( ! interface.identity) {
					log('Invalid interface in detector: ' + interface.identity);
					return false;
				}
				log('Checking registered detector: ' + interface.identity);
				if (interface.detectTag && interface.detectTag()) {
					log('Interface found in detector: ' + interface.identity);
					window._CMLS.adTag = interface;
				}
			});
		}
		if ( ! window._CMLS.adTag || ! window._CMLS.adTag.rawInterface()) {
			log('No interface found, rerunning detection.');
			loopDetection();
			return;
		}
	}

	function loopDetection() {
		detectionLoop = setTimeout(detectTag, 50);
		detectionTimes++;
	}

	detectTag();

}(window.self, jQuery));

// @codekit-prepend "registration.js"
