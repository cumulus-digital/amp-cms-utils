/**
 * Inject a new GPT ad tag for W7M exclusive use.
 * Contains the pos targeting key set to "w7m"
 * Added to global window._CMLS.autoRefreshAdsExclusion list
 */
;(function($, window, undefined) {

	var scriptName = 'W7M Ad Tag Injector',
		version = '0.4',
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

	// Add tag to global refresh exclusion
	window._CMLS.autoRefreshAdsExclusion = window._CMLS.autoRefreshAdsExclusion || [];
	window._CMLS.autoRefreshAdsExclusion.push(elementId);

	window._CMLS.W7M_REQUESTED = false;

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
			window.GPT_SITE_SLOTS = window.GPT_SITE_SLOTS || {};
			window.GPT_SITE_SLOTS[elementId] = slot;
			adTag.addListener('slotRequested', function(e) {
				var slot = e.slot;
				if (slot.getSlotElementId() === elementId) {
					window.self._CMLS = window.self._CMLS || {};
					window.self._CMLS.W7M_REQUESTED = true;
					log('Our slot was requested.', slot);
				}
			});
			log('Defined slot', slot, window.GPT_SITE_SLOTS);

			var $container = $(`
				<div id="${elementId}" style="height: 0;">
					<script>
						googletag.cmd.push(function() {
							googletag.display("${elementId}");
						});
						googletag.cmd.push(function() {
							setTimeout(function(){
								if (
									googletag.pubads().isInitialLoadDisabled()
									&& window.self._CMLS
									&& ! window.self._CMLS.W7M_REQUESTED
								) {
									googletag.pubads().refresh([window.self.GPT_SITE_SLOTS["${elementId}"]]);
								}
							}, 1000);
						});
					</script>
				</div>
			`);
			$container.prependTo('body');
			log('Ad tag appended to body with ID', elementId);

		});

	});

}(jQuery, window.self));