/**
 * Reads DFP targeting criteria from googletag.pubads() and generates
 * GTM and window events from them.
 */
(function(window) {

	var scriptName = 'GLOBALIZE SGROUPS',
		nameSpace = 'globalizeSGroups',
		version = '0.5';

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	if (window._CMLS[nameSpace]) {
		return;
	}

	window._CMLS[nameSpace] = {
		cycles: 0,
		timer: null,

		globalize: function globalize() {
			if ( ! (window.googletag.pubads().G && window.googletag.pubads().G['cms-sgroup'])) {
				if (window._CMLS[nameSpace].cycles > 10) {
					log('Could not retrieve cms-sgroup in a reasonable time, aborting.');
					return;
				}
				log('Googletag not ready, waiting to retry...');
				if (window._CMLS[nameSpace].timer) {
					clearTimeout(window._CMLS[nameSpace].timer);
					window._CMLS[nameSpace].timer = null;
				}
				window._CMLS[nameSpace].timer = setTimeout(window._CMLS[nameSpace].globalize, 500);
				window._CMLS[nameSpace].cycles++;
				return;
			}

			log('Globalizing cms-sgroup');
			window._CMLS.cGroups = window._CMLS.cGroups || [];
			window._CMLS.cGroups = window.googletag.pubads().G['cms-sgroup'];

			var events = ['cms-sgroup'].concat(window._CMLS.cGroups);

			window.sharedContainerDataLayer = window.sharedContainerDataLayer || [];
			window.corpDataLayer = window.corpDataLayer || [];

			log('Firing events');
			for (var i = 0, j = events.length; i < j; i++) {
				window.sharedContainerDataLayer.push({'event': events[i]});
				window.corpDataLayer.push({'event': events[i]});
				window._CMLS.triggerEvent(window, 'cms-sgroup', events[i]);
			}
		}
	};

	window.googletag = window.googletag || {};
	window.googletag.cmd = window.googletag.cmd || [];
	window.googletag.cmd.push(function() {
		log('Googletag command queue initiated.');
		window._CMLS[nameSpace].globalize();
	});

}(window, undefined));