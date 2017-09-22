/**
 * Pushdown ad!
 */
;(function(jQuery, window, undefined) {
	
	var scriptName = 'Pushdown Ad',
		version = '0.4',
		elementId = 'dfp-pushdown';

	function log() {
		if (window.top._CMLS && window.top._CMLS.logger) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	if (!window.document.querySelector('body.home')) {
		log('Not on homepage, exiting.');
		return false;
	}

	var debounce = window._CMLS && window._CMLS.debounce ? 
						window._CMLS.debounce :
						function(callback){ callback(); };

	/* jshint ignore:start */
	/*jsl:ignore* /
	/*ignore jslint start*/

	// Override context of jQuery
	var jQuery = jQuery.noConflict();
	var $ = function(selector,context) {
		return new jQuery.fn.init(selector, context||window.document);
	};
	$.fn = $.prototype = jQuery.fn;
	jQuery.extend($, jQuery);

	/*! jQuery requestAnimationFrame - 0.2.2 - 2016-10-26
	* https://github.com/gnarf37/jquery-requestAnimationFrame
	 * Copyright (c) 2016 Corey Frang; Licensed MIT */
	!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function b(){c&&(window.requestAnimationFrame(b),a.fx.tick())}if(Number(a.fn.jquery.split(".")[0])>=3)return void(window.console&&window.console.warn&&window.console.warn("The jquery.requestanimationframe plugin is not needed in jQuery 3.0 or newer as they handle it natively."));var c;window.requestAnimationFrame&&(a.fx.timer=function(d){d()&&a.timers.push(d)&&!c&&(c=!0,b())},a.fx.stop=function(){c=!1})});

	/*ignore jslint end*/
	/*jsl:end */
	/* jshint ignore:end */

	// Eject if our tag already exists
	if (window.document.getElementById(elementId)) {
		log('Tag already exists, exiting.');
		return false;
	}

	var googletag = window.googletag || {};
	googletag.cmd = googletag.cmd || [];

	googletag.cmd.push(function(){

		var $slotDiv, $timerDiv, $closeBox, $styles, $scripts, $placement;

		// Make sure we can find a place for our pushdown ad
		$placement = $('.wrapper-content:first');

		if (!$placement.length) {
			log('Could not find placement!');
			return false;
		}

		// Find the DFP ID string for the current site
		var adPath = null;
		try {
			var pa = window.googletag.pubads();
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
			return false;
		}
		log('Ad path found, defining new slot.', adPath);

		function showAd() {
			log('Displaying ad.');
			var timeout = 8000,
				$adContainer = $slotDiv.find('iframe:first');
			if ($adContainer.length) {
				log('Got ad iframe.');
				var $img = $adContainer.contents().find('.img_ad'),
					$video = $adContainer.contents().find('video');
				if ($img.length) {
					log('Ad contains an image');
					$img.css({ width: '100%', height: 'auto' });
					var altTest = $img.prop('alt') ? $img.prop('alt').match(/timeout=(\d+)/i) : [];
					if (altTest.length > 1) {
						timeout = altTest[1] * 1000;
					}
					log('Setting hide timer', timeout);
					$timerDiv.css('width', '0%').animate({width: '100%'}, timeout, 'linear', hideAd);
					$slotDiv.slideDown('fast');
				}

				if ($video.length) {
					log('Video detected!');
					// check if video can even be played...
					if (!$video[0].canPlayType || !$video[0].canPlayType('video/mp4').replace(/no/, '')) {
						log ('This browser cannot play mp4 video! exiting.');
						return false;
					}
					$video
						.prop('controls', false)
						.prop('muted', true)
						.prop('playsinline', true)
						.prop('autoplay', false)
						.on('mouseover', function(){
							$video.prop('muted', false);
						})
						.on('mouseout', function(){
							$video.prop('muted', true);
						})
						.on('canplaythrough', function(){
							$slotDiv.slideDown('fast', function(){
								$video[0].play();
							});
						})
						.on('playing', function(){
							log('Setting the hide timer', this.duration * 1000);
							$timerDiv.css('width', '0%').animate({width: '100%'}, this.duration * 1000, 'linear');
						})
						.on('ended', hideAd);
				}

				return;
			}

			log('Could not get ad iframe!');

		}

		function hideAd() {
			log('Hiding ad.');
			$timerDiv.stop().clearQueue();
			$slotDiv.stop().clearQueue().slideUp();
		}

		$slotDiv = $('<div id="' + elementId + '-container" />').css('display', 'none');
		$styles = $(
			'<style>' +
				'#' + elementId + '-container { font-size: 24px; font-size: 5vw; font-weight: lighter; line-height: 0 !important; margin: 0 auto; max-width: 1020px; overflow: hidden; position: relative; }' +
				'#' + elementId + ' div[id*="google_ads"] { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; }' +
				'#' + elementId + ' iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }' +
				'#' + elementId + ' { position: relative; margin-bottom: 10px; }' +
				'#' + elementId + '-close { cursor: pointer; position: absolute; top: .75em; right: .3em; z-index: 100000; color: white; font-family: sans; text-shadow: .25em .25em .25em black; mix-blend-mode: exclusion; }' +
				'#' + elementId + '-timer { position: absolute; bottom: 7px; left: 0; z-index: 100000; height: 3px; width: 0%; background: #A33; }' +
				'@media (min-width: 550px) { #' + elementId + '-container { font-size: 24px; } }' +
			'</style>'
		).appendTo($slotDiv);
		$scripts = $('<div id="' + elementId + '"><script>googletag.cmd.push(function() { googletag.display("' + elementId + '")});</sc'+'ript></div>').appendTo($slotDiv);
		$closeBox = $('<div id="' + elementId + '-close" title="Close">✕</div>').click(hideAd).appendTo($slotDiv);
		$timerDiv = $('<div id="' + elementId + '-timer"></div>').appendTo($slotDiv);

		// Hook into the DFP render event so we know when to hide/show the ad
		function checkRenderEvent(e) {
			if (e.slot.getSlotElementId() === elementId) {
				log('Caught render event for pushdown', e.slot.getSlotElementId());
				if (e.isEmpty) {
					log('Slot was empty, hiding.');
					hideAd();
					return;
				}
				log('Rendering ad.');
				showAd();
			}
		}
		googletag.cmd.push(function(){
			googletag.pubads().addEventListener('slotRenderEnded', function(e) {
				log(e);
				debounce(checkRenderEvent(e), 1000);
			});
		});

		log('Injecting ad tag.');
		googletag.cmd.push(function(){
			googletag.defineSlot(adPath, [1020,574], elementId)
				.setCollapseEmptyDiv(true)
				.setTargeting('pos', 'pushdown')
				.addService(googletag.pubads());
		});
		$placement.prepend($slotDiv);
	});

}(jQuery, window.self));