/**
 * Reads cms-sgroup DFP targeting criteria and generates GTM events with them.
 * MUST BE FIRED AT DOM READY EVENT gtm.dom
 */
(function($, window, undefined) {
	"use strict";
	
	var version = '0.4';

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			var ts = (new Date());
			ts = ts.toISOString() ? ts.toISOString() : ts.toUTCString();
			console.log('%c[GLOBALIZE SGROUPS ' + version + ']', 'background: #75be84; color: #FFF', ts, [].slice.call(arguments));
		}
	}

	// Define only once.
	window._CMLS = window._CMLS || {};
	if (window._CMLS.cGroups && window._CMLS.cGroups.length) {
		log('Already defined, skipping');
		return;
	}

	$(function() {
		log('Initializing');
		$('script:not([src]):contains("cms-sgroup"):first').each(function(i, s) {
			var sGroups = s.innerHTML.match(/'cms-sgroup'\s*,\s*\[?'([^\]|\)]+)/i);
			if (sGroups && sGroups.length > 1) {
				log('sgroups retrieved, firing events');
				sGroups = sGroups[1].replace(/'$/, '').split(/',\s*'/);
				window._CMLS.cGroups = window._CMLS.cGroups || [];
				window._CMLS.cGroups.push.apply(window._CMLS.cGroups, sGroups);
				window.sharedContainerDataLayer = window.sharedContainerDataLayer || [];
				window.sharedContainerDataLayer.push({'event': 'cms-sgroup'});
				window.corpDataLayer = window.corpDataLayer || [];
				window.corpDataLayer.push({'event': 'cms-sgroup'});
				for(var l = 0; l < sGroups.length; l++) {
					if (sGroups[l].indexOf('Format') > -1 || sGroups[l].indexOf('Market') > -1) {
						log('Firing event', sGroups[l]);
						window.sharedContainerDataLayer.push({'event': sGroups[l]});
						window.corpDataLayer.push({'event': sGroups[l]});
					}
				}
			} else {
				log('sgroups could not be retireved');
			}
		});
	});

}(jQuery, window));