/**
 * Reads DFP targeting criteria from googletag.pubads, stores them
 * in a predictable place and generates GTM and window events from them
 */
;(function(window, undefined){
	
	var scriptName = 'GLOBALIZE SGROUPS',
		nameSpace = 'globalizeSGroups',
		version = '0.6',
		_CMLS = window._CMLS || {};

	function log() {
		_CMLS.log(scriptName + ' v' + version, arguments);
	}

	if (_CMLS[nameSpace]) {
		return;
	}

	function GlobalizeSGroups(){
		var sgroup_container;

		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];

		window.googletag.cmd.push(function(){

			// Loop through googletag properties to find sgroups
			var dfp_props = window.googletag.pubads();
			for (var z in dfp_props) {
				if ( ! dfp_props[z].hasOwnProperty('cms-sgroup')){
					continue;
				}
				sgroup_container = dfp_props[z]['cms-sgroup'];
				break;
			}

			// If we have sgroups, we're good!
			if (sgroup_container) {
				log('s-groups acquired!');
				// store sGroups
				_CMLS.sGroups = sgroup_container;

				// Set up and fire events
				var events = ['cms-sgroup'].concat(_CMLS.sGroups);
				window.sharedContainerDataLayer = window.sharedContainerDataLayer || [];
				window.corpDataLayer = window.corpDataLayer || [];

				log('Firing events.');
				for (var i in events) {
					if (events.hasOwnProperty(i)) {
						window.sharedContainerDataLayer.push({'event': events[i]});
						window.corpDataLayer.push({'event': events[i]});
						_CMLS.triggerEvent(window, 'cms-sgroup', events[i]);
					}
				}
			}
		});
	}

	log('Initializing.');
	_CMLS[nameSpace] = new GlobalizeSGroups();

}(window))