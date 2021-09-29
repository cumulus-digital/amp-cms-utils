/**
 * Inject a new GPT ad tag for W7M exclusive use.
 * Contains the pos targeting key set to "w7m"
 * Added to global window.autoRefreshAdsExclusion list
 */
;(function($, window, undefined) {

	var scriptName = 'W7M Ad Tag Injector',
		version = '0.1',
		dfpNetworkCode = '6717',
		elementId = 'dfp-w7mtag';

	var doc = window.document;

	function log() {
		if (window.top._CMLS && window.top._CMLS.logger) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	// Must be run *after* googletag has been defined
	if (!window.hasOwnProperty("googletag")) {
		log('DFP library must be included and "googletag" window variable must be available before including this library.');
		return false;
	}

	$(function() {

		var adTag = window._CMLS.adTag;
		adTag.queue(function() {
			if (doc.getElementById(elementId)) {
				log('Element already injected, exiting.');
				return;
			}

			// Attempt to fetch the site's DFP properties and ad unit paths
			log('Discovering local site ad path.');
			var adPath = null;
			try {
				var pa = adTag.rawInterface().pubads();
				var slots = pa.getSlots();
				for (var s in slots) {
					var name = slots[s].getSlotId().getName();
					if (name && name.indexOf('/' + dfpNetworkCode + '/') > -1) {
						adPath = name;
						break;
					}
				}
				for (var t in slots) {
					if (slots[t].getSlotElementId() === elementId) {
						log('Destroying existing slot');
						adTag.rawInterface().destroySlots([slots[t]]);
					}
				}
				if (adPath === null) { throw { message: 'Could not retrieve ad unit path.' }; }
			} catch(e) {
				log('Failed to retrieve DFP properties.', e);
				return;
			}
			log('Ad path found, defining new slot.', adPath);

			var slot = adTag.defineSlot(
				[
					adPath,
					[[1,1]],
					elementId
				],
				true,
				{ 'pos': 'w7m' },
				true
			);

			var $container = $(`
				<div id="${elementId}">
					<script>googletag.cmd.push(function() { googletag.display("${elementId}"); });</script>
				</div>
			`);
			$container.appendTo('body');
			log('Ad tag appended to body with ID', elementId);

		});

	});

}(jQuery, window.self));