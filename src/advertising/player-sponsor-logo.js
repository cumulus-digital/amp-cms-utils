/**
 * Injects an ad tag which allows a sponsor logo to appear in both Tune Genie and Triton players
 */
;(function($, window, undefined){

	var scriptName = 'PLAYER SPONSOR INJECTOR',
		nameSpace = 'playerSponsorInjector',
		version = '0.1',
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

		adTag.queue(function(){
			$(function(){
				// Eject if our tag already exists.
				if ($('#CMLSPlayerSponsorship').length) {
					log('Container already exists, exiting.');
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
						if (name && name.indexOf('/6717/') > -1) {
							adPath = name;
							break;
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
						[[120,60]],
						'CMLSPlayerSponsorship'
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

				// update z-index after 2 seconds
				var zIndex = 200000;
				setTimeout(function() {
					if (player.type === window._CMLS.const.PLAYER_TUNEGENIE) {
						var tgObj = $('#' + window.top.tgmp.divId);
						if (tgObj.css('z-index')) {
							zIndex = tgObj.css('z-index') + 1;
						}
					}
					if (zIndex > 2147483647) {
						zIndex = 2147483647;
					}
					$('#CMLSPlayerSponsorship').css('z-index', zIndex);
				}, 2000);

				// Append ad container styles
				$('body').append(
					'<style id="CMLSPlayerSponsorshipStyle">' +
						'#CMLSPlayerSponsorship {' +
							'position: fixed;' +
							'z-index: ' + zIndex + ';' +
							'width: 120px;' +
							'height: 60px;' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-tg {' +
							'left: 50%;' +
							'transform: translate(+290px, 0);' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-triton {' +
							'left: 50%;' +
							'transform: translate(30px, 0);' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-pos-bottom {' +
							'bottom: 4px;' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-pos-top {' +
							'top: 4px;' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-triton.cmls-player-pos-top {' +
							'top: 5px;' +
						'}' +
						'@media (max-width: 75rem) {' +
							'#CMLSPlayerSponsorship.cmls-player-tg {' +
								'left: 50%;' +
							'}' +
						'}' +
						/*
						'@media (max-width: 1042px) {' +
							'#CMLSPlayerSponsorship.cmls-player-tg {' +
								'display: none' +
							'}' +
						'}' +
						'@media (max-width: 800px) {' +
							'#CMLSPlayerSponsorship.cmls-player-triton {' +
								'display: none' +
							'}' +
						'}' +
						*/
					'</style>'
				);

				// Append ad container
				var sponsorContainer = $(
					'<div id="CMLSPlayerSponsorship">' +
						'<sc'+'ript>googletag.cmd.push(function() { googletag.display("CMLSPlayerSponsorship")});</sc'+'ript>' +
					'</div>'
				);
				var position = 'bottom';
				if (player.position === _CMLS.const.PLAYER_POSITION_TOP) {
					position = 'top';
				}
				if (player.type === _CMLS.const.PLAYER_TRITON) {
					sponsorContainer.addClass('cmls-player-triton');
				}
				if (player.type === _CMLS.const.PLAYER_TUNEGENIE) {
					sponsorContainer.addClass('cmls-player-tg');
				}

				if (position === 'top') {
					sponsorContainer.addClass('cmls-player-pos-top');
				} else {
					sponsorContainer.addClass('cmls-player-pos-bottom');
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