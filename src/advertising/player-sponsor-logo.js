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
		var gt = window.top.googletag || {};
		gt.cmd = gt.cmd || [];
		gt.cmd.push(function(){
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
					var pa = gt.pubads();
					var props = Object.getOwnPropertyNames(pa);
					for (var z in props) {
						var paprops = pa[props[z]];
						if (paprops.constructor && paprops.constructor === Array) {
							for (var x in paprops[0]) {
								if (paprops[0][x] && paprops[0][x].constructor === String && paprops[0][x].indexOf('/6717/') > -1) {
									adPath = paprops[0][x];
									break;
								}
							}
						}
						if (adPath) {
							break;
						}
					}
					if (adPath === null) { throw { message: 'Could not retrieve ad unit path.' }; }
				} catch(e) {
					log('Failed to retrieve DFP properties.', e);
					return;
				}
				log('Ad path found, defining new slot.', adPath);

				var slot = gt.defineSlot(
					adPath,
					[[120,60]],
					'CMLSPlayerSponsorship'
				);
				if (slot) {
					slot.addService(gt.pubads())
						.setCollapseEmptyDiv(true)
						.setTargeting('pos', 'playersponsorlogo');
				}

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
							'transform: translate(-520px, 0);' +
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

}(window.top.jQuery, window));