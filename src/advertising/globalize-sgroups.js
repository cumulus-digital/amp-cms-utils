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
			var sgroup_container;
			try {
				if ( ! window.googletag || ! window.googletag.pubads()) {
					throw { message: 'Googletag not yet ready.' };
				}
				var dfp_props = window.googletag.pubads();
				for (var z in dfp_props) {
					if ( ! dfp_props[z].hasOwnProperty('cms-sgroup')) {
						continue;
					}
					sgroup_container = dfp_props[z]['cms-sgroup'];
					break;
				}
			} catch (e) {
				if (window._CMLS[nameSpace].cycles > 10) {
					log('TERMINATING. Could not retrieve cms-sgroup in a reasonable time, aborting.');
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
			window._CMLS.cGroups = sgroup_container;

			var events = ['cms-sgroup'].concat(window._CMLS.cGroups);

			window.sharedContainerDataLayer = window.sharedContainerDataLayer || [];
			window.corpDataLayer = window.corpDataLayer || [];

			log('Firing events');
			function fireEvents(e) {
				log('Firing event', e);
				window.sharedContainerDataLayer.push({'event': e});
				window.corpDataLayer.push({'event': e});
				window._CMLS.triggerEvent(window, 'cms-sgroup', e);
			}

			var isWestwood = false;
			for (var i = 0, j = events.length; i < j; i++) {
				fireEvents(events[i]);
				
				if (events[i].indexOf('Westwood One') > -1) {
					isWestwood = true;
				}
			}
			
			if (isWestwood === true) {
				fireEvents('Westwood One Property');
			} else {
				fireEvents('Cumulus Owned and Operated');
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