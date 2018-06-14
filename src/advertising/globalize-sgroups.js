/**
 * Read page targeting criteria and generate events for
 * Triton's cms-sgroups
 */
;(function(window) {

	var scriptName = 'GLOBALIZE SGROUPS',
		nameSpace = 'globalizeSGroups',
		version = '0.6';

	function log() {
		if(window.top._CMLS && window.top._CMLS.hasOwnProperty('logger')) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	if (window._CMLS[nameSpace]) {
		log('Already registered.');
		return;
	}

	function GlobalizeSGroups() {
		var cycles = 0,
			timer = 0,
			me = this;

		this.fireEvents = function(e) {
			window.sharedContainerDataLayer.push({'event': e});
			window.corpDataLayer.push({'event': e});
			window._CMLS.triggerEvent(window, 'cms-sgroup', e);
		};

		this.globalize = function() {

			// Attempt to discover DFP page targeting
			if (window._CMLS.adTag.pubads() && window._CMLS.adTag.pubads().getTargeting('cms-sgroup')) {
				
				// Register sgroups in our global container
				window._CMLS.cGroups = window._CMLS.adTag.pubads().getTargeting('cms-sgroup') || [];

				// Fire events
				window.sharedContainerDataLayer = window.sharedContainerDataLayer || [];
				window.corpDataLayer = window.corpDataLayer || [];


				var isWestwood = false;
				window._CMLS.cGroups.forEach(function(cGroup) {
					log('Firing cms-sgroup event', cGroup);
					me.fireEvents(cGroup);

					if (cGroup.indexOf('Westwood One') > -1) {
						isWestwood = true;
					}
				});

				if (isWestwood === true) {
					me.fireEvents('Westwood One Property');
				} else {
					me.fireEvents('Cumulus Owned and Operated');
				}

			} else {

				// DFP is not yet available, retry
				if (cycles > 10) {
					log('TERMINATING. Could not retrieve page targeting in a reasonable time.');
					return false;
				}

				log('DFP is not ready, waiting to retry...');
				clearTimeout(timer);
				timer = null;
				timer = setTimeout(me.globalize, 500);
				cycles++;
				return;

			}
		};

		me.globalize();
	}

	window._CMLS.adTag.queue(function() {
		log('adTag command queue initiated.');
		window._CMLS[nameSpace] = new GlobalizeSGroups();
	});

}(window.self));