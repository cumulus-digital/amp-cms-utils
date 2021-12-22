/**
 * Injects an ad tag which allows a sponsor logo to appear in both Tune Genie and Triton players
 */
;(function($, window, undefined){

	var scriptName = 'PLAYER SPONSOR INJECTOR',
		nameSpace = 'playerSponsorInjector',
		version = '0.4',
		dfpNetworkCode = '6717',
		elementId = 'CMLSPlayerSponsorship',
		zIndex = 200000,
		_CMLS = window._CMLS;

	function log() {
		_CMLS.logger(scriptName + ' v' + version, arguments);
	}

	/**
	 * If we're not the top window, assume we're on a second click in the TuneGenie player
	 * and activate the sponsor adtag in the parent window.
	 */
	if (window.self !== window.top) {
		$(function(){
			log('Within TuneGenie frame, activating player sponsor init in parent window.');
			window.parent._CMLSPlayerSponsorshipInit = window.parent._CMLSPlayerSponsorshipInit || [];
			window.parent._CMLSPlayerSponsorshipInit.push(1);
		});
		return;
	}

	var check_count = 0;

	function init(){
		var adTag = window._CMLS.adTag,
			player = _CMLS.whichPlayer();

		if ( ! player.type) {
			log('Player not found, checking again in 2 seconds... (' + (5 - check_count) + ' checks remaining)');
			if (check_count < 5) {
				check_count++;
				setTimeout(init, 2000);
			} else {
				log('Player was not found, exiting for good.');
			}
			return;
		}

		log('Player found', player);

		var dWidthTest = window.matchMedia("(max-width: 1042px)");
		if (dWidthTest.matches) {
			log('Device width is below 1042px');
			return;
		}

		// Append ad container styles
		if ( ! $('#' + elementId + 'Style').length) {
			$('body').append(
				'<style id="' + elementId + 'Style">' +
					'#' + elementId + ' {' +
						'position: fixed;' +
						'z-index: ' + zIndex + ';' +
						'width: 120px;' +
						'height: 60px;' +
					'}' +
					'#' + elementId + '.cmls-player-tg {' +
						'left: 50%;' +
						'transform: translate(+290px, 0);' +
					'}' +
					'#' + elementId + '.cmls-player-triton {' +
						'left: 50%;' +
						'transform: translate(30px, 0);' +
					'}' +
					'#' + elementId + '.cmls-player-pos-bottom {' +
						'bottom: 4px;' +
					'}' +
					'#' + elementId + '.cmls-player-pos-top {' +
						'top: 4px;' +
					'}' +
					'#' + elementId + '.cmls-player-triton.cmls-player-pos-top {' +
						'top: 5px;' +
					'}' +
					'@media (max-width: 75rem) {' +
						'#' + elementId + '.cmls-player-tg {' +
							'left: 50%;' +
						'}' +
					'}' +
					/*
					'@media (max-width: 1042px) {' +
						'#' + elementId + '.cmls-player-tg {' +
							'display: none' +
						'}' +
					'}' +
					'@media (max-width: 800px) {' +
						'#' + elementId + '.cmls-player-triton {' +
							'display: none' +
						'}' +
					'}' +
					*/
				'</style>'
			);
		}

		adTag.queue(function(){
			$(function(){
				// Eject if our tag already exists.
				if (
					window.self.document.getElementById(elementId) ||
					window.self.parent.document.getElementById(elementId) ||
					window.top.document.getElementById(elementId) ||
					$('#' + elementId).length
				) {
					log('Container already exists, exiting.');
					return;
				}

				// Attempt to fetch the site's DFP properties and ad unit paths
				log('Discovering local site ad path.');
				var adPath = null;
				try {
					if (window.GPT_SITE_ID) {
						adPath = window.GPT_SITE_ID;
					} else {
						var pa = adTag.rawInterface().pubads(),
							slots = pa.getSlots();
						if (slots.length) {
							slots.some(function(slot) {
								var p = slot.getAdUnitPath();
								if (p.indexOf('/' + dfpNetworkCode +'/') > -1) {
									adPath = p;
									return true;
								}
							});
							if (adPath === null || adPath === undefined) { throw { message: 'Could not retrieve ad unit path.' }; }
						}
					}
				} catch(e) {
					log('Failed to retrieve DFP properties.', e);
					return;
				}
				log('Ad path found, defining new slot.', adPath);

				var slot = adTag.rawInterface().defineSlot(adPath, [120,60], elementId)
					.setCollapseEmptyDiv(true)
					.setTargeting('pos', 'playersponsorlogo')
					.addService(googletag.pubads());

				/*
				var slot = adTag.defineSlot(
					[
						adPath,
						[[120,60]],
						elementId
					],
					true,
					{ 'pos': 'playersponsorlogo' },
					true
				);
				if (adTag.identity === 'dfp') {
					var sizeMap = adTag.rawInterface().sizeMapping()
							.addSize([800, 0], [[120,60]])
							.addSize([0, 0], [])
							.build();
					slot.defineSizeMapping(sizeMap);
				}
				*/

				// update z-index after 2 seconds
				setTimeout(function() {
					if (player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
						var tgObj = $('#' + window.top.tgmp.divId);
						if (tgObj.css('z-index')) {
							zIndex = parseInt(tgObj.css('z-index'), 10) + 1;
						}
					}
					if (zIndex > 2147483647) {
						zIndex = 2147483647;
					}
					$('#' + elementId).css('z-index', zIndex);
				}, 2000);

				// Append ad container
				var sponsorContainer = $('<div />', { id: elementId, class: "cmls-player-tg cmls-player-pos-top" });
					sponsorContainer.html(
						'<script> \
							googletag.cmd.push(function() { \
								var sizeMap = .sizeMapping() \
									.addSize([800, 0], [[120,60]]) \
									.addSize([0, 0], []) \
									.build(); \
								googletag.defineSlot("' + adPath + '", [120,60], "' + elementId + '") \
									.setCollapseEmptyDiv(true) \
									.setTargeting("pos", "playersponsorlogo") \
									.addService(googletag.pubads()) \
									.defineSizeMapping(sizeMap); \
								googletag.display("' + elementId + '"); \
							}); \
						</sc'+'ript>'
					);

				if (player.position === _CMLS.const.PLAYER_POSITION_TOP) {
					sponsorContainer.removeClass('cmls-player-pos-bottom')
						.addClass('cmls-player-pos-top');
				}
				if (player.type === _CMLS.const.PLAYER_TRITON) {
					sponsorContainer.removeClass('cmls-player-tg')
						.addClass('cmls-player-triton');
				}

				$('body').append(sponsorContainer);

				log('Slot initialized.');

			});
		});
	}

	var SponsorArray = function(){};
	SponsorArray.prototype = [];
	SponsorArray.prototype.push = function(){
		init();
	};
	window.self._CMLSPlayerSponsorshipInit = new SponsorArray();

	$(init());

	_CMLS[nameSpace] = version;

}(window.top.jQuery, window));