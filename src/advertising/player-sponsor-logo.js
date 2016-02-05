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

	function init(){
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push(function(){
			$(function(){
				// Eject if our tag already exists.
				if ($('#CMLSPlayerSponsorship').length) {
					return;
				}

				// Attempt to fetch the site's DFP properties and ad unit paths
				log('Discovering local site ad path.');
				var adPath = null;
				try {
					var props = Object.getOwnPropertyNames(window.googletag.pubads().$);
					var slotProps = window.googletag.pubads().$[props[0]];
					for (var z in slotProps) {
						if (slotProps[z].indexOf('/6717/') > -1) {
							adPath = slotProps[z];
							break;
						}
					}
					if (adPath === null) { throw { message: 'Could not retrieve ad unit path.' }; }
				} catch(e) {
					log('Failed to retrieve DFP properties.', e);
					return;
				}
				log('Ad path found, defining new slot.', adPath);

				window.googletag.defineSlot(
					adPath,
					[[120,60]],
					'CMLSPlayerSponsorship'
				)
					.addService(window.googletag.pubads())
					.setCollapseEmptyDiv(true)
					.setTargeting('pos', 'playersponsorlogo');

				// Append ad container styles
				$('body').append(
					'<style id="CMLSPlayerSponsorshipStyle">' +
						'#CMLSPlayerSponsorship {' +
							'position: fixed;' +
							'z-index: 2147483647;' +
							'width: 120px;' +
							'height: 60px;' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-tg {' +
							'left: 50%;' +
							'transform: translate(-510px, 0);' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-triton {' +
							'left: 50%;' +
							'transform: translate(30px, 0);' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-pos-bottom {' +
							'bottom: 10px;' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-pos-top {' +
							'top: 10px;' +
						'}' +
						'#CMLSPlayerSponsorship.cmls-player-triton.cmls-player-pos-top {' +
							'top: 5px;' +
						'}' +
						'@media (max-width: 75rem) {' +
							'#CMLSPlayerSponsorship.cmls-player-tg {' +
								'left: 80px;' +
								'transform: translate(0,0);' +
							'}' +
						'}' +
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
					'</style>'
				);

				// Append ad container
				var sponsorContainer = $(
					'<div id="CMLSPlayerSponsorship">' +
						'<sc'+'ript>googletag.cmd.push(function() { googletag.display("CMLSPlayerSponsorship")});</sc'+'ript>' +
					'</div>'
				), player = _CMLS.whichPlayer();
				if (player.position === _CMLS.const.PLAYER_POSITION_TOP) {
					sponsorContainer.addClass('cmls-player-pos-top');
				}
				if (player.position === _CMLS.const.PLAYER_POSITION_BOTTOM) {
					sponsorContainer.addClass('cmls-player-pos-bottom');
				}
				if (player.type === _CMLS.const.PLAYER_TRITON) {
					sponsorContainer.addClass('cmls-player-triton');
				}
				if (player.type === _CMLS.const.PLAYER_TUNEGENIE) {
					sponsorContainer.addClass('cmls-player-tg');
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

}(jQuery, window));