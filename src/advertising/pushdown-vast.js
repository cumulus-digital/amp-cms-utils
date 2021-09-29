/**
 * "Pushdown" Ad
 * Generates and injects a DFP ad tag at the start of the AMP CMS
 * ".wrapper-content" with targeting pos="pushdown" ON HOMEPAGES ONLY.
 * The ad is displayed by pushing the site content down and revealing 
 * the ad for a period of time, after which it disappears and returns
 * the content area to its original position. Supports the basic 
 * "Image" DFP creative type for static images as well as two methods
 * for trafficking video with Custom Creative HTML code.
 *
 * "Image" creatives are displayed for a default of 8 seconds, but this
 * timout may be overridden in the creative by specifying "timeout=#" in
 * the creative's "alt" attribute, where # is a number of seconds.
 *
 * Video creatives timeout is the duration of the video.
 * 
 * Ad dimensions are locked to 16:9 aspect ratio (1020x574) in order to
 * be responsive to device viewport.
 */
;(function(jQuery, window, undefined) {

	var scriptName = 'Pushdown Ad',
		version = '0.6',
		dfpNetworkCode = '6717',
		elementId = 'dfp-pushdown2',
		defaultTimeout = 15;

	var doc = window.document;

	function log() {
		if (window.top._CMLS && window.top._CMLS.logger) {
			window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	// Pushdowns only appear on homepages
	if (!doc.querySelector('body.home')) {
		log('Not on homepage, exiting.');
		return false;
	}

	// Don't run if our tag already exists
	if (doc.getElementById(elementId)) {
		log('Tag already exists, exiting.');
		return false;
	}

	// Must be run *after* googletag has been defined
	if (!window.hasOwnProperty("googletag")) {
		log('DFP library must be included and "googletag" window variable must be available before including this library.');
		return false;
	}

	var googletag = window.googletag;

	var debounce = window._CMLS && window._CMLS.debounce ? 
						window._CMLS.debounce :
						function(callback){ callback(); };

	/**
	 * Since the sites use a persistant "listen live" player which may
	 * or may not house the site content within an iframe, we need
	 * to override the context of jQuery to use the current window.
	 */
	/* jshint ignore:start */
	/*jsl:ignore* /
	/*ignore jslint start*/

	// Override context of jQuery
	jQuery = jQuery.noConflict();
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

	googletag.cmd.push(function(){
		var adPath, // DFP ID string holder
			$pushdownContainer, // Ad container
			$slotContainer,
			$timerDiv, // Virtual "timer" display
			$closeBox, // "close" button
			$styles, // CSS to inject
			$scripts, // Scripts to inject
			$placement; // DOM position to inject within

		$placement = $('.wrapper-content:first');
		if (!$placement.length) {
			log('Could not find ".wrapper-content" element.');
			return false;
		}

		/**
		 * Inspects the googletag object to find the current site's
		 * DFP ID string for use in the generated tag.
		 */
		try {
			if (window.GPT_SITE_ID) {
				adPath = window.GPT_SITE_ID;
			} else {
				var pa = googletag.pubads(),
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
			return false;
		}
		adPath = adPath + '/pushdown';
		log('Ad path found, defining new slot with "/pushdown" level.', adPath);

		// Create our ad container
		var pushdownContainer = doc.createElement('div');
			pushdownContainer.id = elementId+'-container';
			pushdownContainer.style.display = 'none';
		$pushdownContainer = $(pushdownContainer);

		var slotContainer = doc.createElement('div');
			slotContainer.id = elementId;
		$slotContainer = $(slotContainer).appendTo($pushdownContainer);

		var styles = doc.createElement('style');
			// jshint multistr:true
			styles.innerText = ' \
				#' + elementId + '-container { \
					font-size: 24px !important; \
					font-size: 5vw !important; \
					font-weight: lightest !important; \
					line-height: 0 !important; \
					margin: 0 auto !important; \
					max-width: 1020px !important; \
					overflow: hidden !important; \
					position: relative !important; \
					z-index: 1 !important; \
				} \
				#' + elementId + ' { \
					position: relative; \
					margin-bottom: 10px; \
				} \
				#' + elementId + ' div[id*="google_ads"] { \
					position: relative; \
					padding-bottom: 56.25%; \
					max-width: 100%; \
					height: 0; \
					overflow: hidden; \
				} \
				#' + elementId + ' iframe { \
					width: 100%; \
					height: 100%; \
					position: absolute; \
					top: 0; \
					left: 0; \
				} \
				#' + elementId + '-close { \
					color: white; \
					font-family: sans !important; \
					text-shadow: .05em .05em .25em black; \
					mix-blend-mode: exclusion; \
					cursor: pointer; \
					position: absolute; \
					top: .75em; \
					right: .3em; \
					z-index: 100000; \
				} \
				#' + elementId + '-timer { \
					background: #a33; \
					width: 0; \
					height: 3px; \
					position: absolute; \
					bottom: 7px; \
					left: 0; \
					z-index: 100000; \
				} \
				@media (min-width: 550px) { \
					#' + elementId + '-container { font-size: 24px !important; } \
				} \
				';
		$styles = $(styles).appendTo($pushdownContainer);

		// JS doesn't seem to execute when element is created otherwise...
		$scripts = $(
			'<script> \
				googletag.cmd.push(function() { \
					googletag.display("' + elementId + '"); \
				}); \
			</sc'+'ript>'
		).appendTo($slotContainer);

		var closeBox = doc.createElement('div');
			closeBox.id = elementId + '-close';
			closeBox.title = 'Close';
			closeBox.innerText = '✕';
		$closeBox = $(closeBox)
			.on('click', function() {
				$pushdownContainer.trigger('cmls.hide');
			})
			.appendTo($pushdownContainer);

		var timerDiv = doc.createElement('div');
			timerDiv.id = elementId + '-timer';
		$timerDiv = $(timerDiv).appendTo($pushdownContainer);

		/**
		 * Hiding and showing the ad container is controlled by events
		 */
		$pushdownContainer.on('cmls.display', function(e, callback) {
			log('Displaying ad');
			$pushdownContainer
				.stop()
				.clearQueue()
				.slideDown('fast');
			if (callback) {
				callback();
			}
		});
		$pushdownContainer.on('cmls.hide', function(e, callback) {
			log('Hiding ad.');
			$timerDiv.trigger('cmls.reset');
			$pushdownContainer
				.stop()
				.clearQueue()
				.slideUp();
			if (callback) {
				callback();
			}
		});

		/**
		 * Events to control starting the timer div display and resetting
		 */
		$timerDiv.on('cmls.start', function(e, duration, callback) {
			log('Timer display started with duration', duration);
			$timerDiv.trigger('cmls.reset', function() {
				log('Animating timerDiv');
				$timerDiv.animate(
					{ width: '100%' },
					duration,
					'linear',
					callback
				);
			});
		});
		$timerDiv.on('cmls.reset', function(e, callback) {
			log('Resetting timerDiv to 0');
			$timerDiv
				.stop()
				.clearQueue()
				.css('width', 0);
			if (callback) {
				log('Callback from cmls.reset firing.');
				callback();
			}
		});

		/**
		 * Detect creative type within an ad container
		 * @param  {jQuery} $adFrame  iframe of ad
		 * @return {(string|boolean)} Type of ad creative, "image" "vast" "video"
		 */
		function detectCreative($adFrame) {
			if (!$adFrame.length) {
				log('Could not find DFP iframe within ad container.');
				return false;
			}

			try {
				$adFrame.contents();
			} catch(e) {
				log('Could not retrieve ad container contents, is this a safe frame?');
				return false;
			}

			if ($adFrame.contents().find('#vpContainer').length) {
				return "vast";
			}
			if ($adFrame.contents().find('.img_ad').length) {
				return "image";
			}
			if ($adFrame.contents().find('video').length) {
				return "video";
			}

			return false;
		}

		/**
		 * Format and display an Image creative type
		 * @param  {jQuery} $adFrame
		 * @return {boolean}
		 */
		function handleImage($adFrame) {
			log('Handling Image creative type.');
			var $img = $adFrame
				.contents()
				.find('.img_ad');
			if (!$img.length) {
				log('Attempted to handle an image creative, but no image was found.');
				return false;
			}

			// Make image responsive
			log('Making image responsive.');
			$img.css({ width: '100%', height: 'auto' });

			// Detect an override for timeout
			log('Checking for timeout override');
			var altTest = $img.prop('alt');
			var timeout = defaultTimeout * 1000;
			if (altTest) {
				altTest = altTest.match(/timeout=(\d+)/i);
				if (altTest.length > 1) {
					timeout = altTest[1] * 1000;
				}
			}

			log('Triggering ad display with timeout', timeout);			
			$pushdownContainer.trigger('cmls.display', function() {
				$timerDiv.trigger('cmls.start', [timeout, function() {
					log('Triggering ad removal.');
					$pushdownContainer.trigger('cmls.hide');
				}]);
			});

			return true;
		}

		/**
		 * Setup and display a custom HTML video creative type
		 * @param  {jQuery} $adFrame
		 * @return {boolean}
		 */
		function handleVideo($adFrame) {
			log('Handling custom html video creative type.');
			var $video = $adFrame
					.contents()
					.find('video'),
				$sources = $video.find('source');

			if (!$video.length) {
				log('Attempted to handle a custom video creative, but no video tag was found.');
				return false;
			}

			// Ensure the current browser supports HTML video
			if (!$video[0].canPlayType) {
				log('Current browser does not support HTML video.');
				return false;
			}

			/**
			 * Check the video sources for a MIME type
			 * compatible with the current browser.
			 */
			var validVideo = false;
			$sources.each(function() {
				var mime = $(this).prop('type');
				if (
					!mime ||
					!$video[0].canPlayType(mime).replace(/no/, '')
				) {
					return true;
				}
				validVideo = $(this);
				return false;
			});
			if (validVideo === false) {
				log('No video source was found to be compatible with this browser.');
				return false;
			}
			log('Video has a compatible source.');

			// Set up video
			$video
				.prop('controls', false)
				.prop('muted', true)
				.prop('playsinline', true)
				.prop('autoplay', false)

				// Unmute video if user mouses over
				.on('mouseover', function() {
					$video.prop('muted', false);
				})
				// Mute if user mouses out
				.on('mouseout', function() {
					$video.prop('muted', true);
				})

				// Once we can play the entire video,
				// trigger container to display and
				// start playing.
				.on('canplaythrough', function() {
					$pushdownContainer.trigger('cmls.display', function() {
						$video[0].play();
					});
				})

				// When video starts playing, set the hide timer
				.on('playing', function() {
					$timerDiv.trigger('cmls.start', this.duration * 1000);
				})

				// When video ends, trigger container to hide
				.on('ended', function() {
					$pushdownContainer.trigger('cmls.hide');
				});

			log('Video initialized.');
			return true;
		}

		/**
		 * Set up and display VAST-delivered video
		 * @param  {jQuery} $adFrame
		 * @return {boolean}
		 */
		function handleVast($adFrame) {
			log('Handling VAST-delivered creative.');

			var vpPushdown = {
				'init': function() {
					log('Initializing VAST player.');

					var iDoc = $adFrame.contents()[0],
						iWin = iDoc.defaultView,
						vpContainer = iDoc.getElementById('vpContainer');
					
					if (!vpContainer) {
						log('Attempted to handle VAST creative but no vpContainer was found.');
						return false;
					}

					var vpURL = vpContainer.getAttribute('data-vpurl');

					if (!vpURL || vpURL.length < 1) {
						log('No vpurl attribute provided!');
						return false;
					}

					vpURL = vpURL
						.replace('[timestamp]', (new Date()).getTime())
						.replace('[referrer_url]', window.location.href);

					iWin.player = new iWin.VASTPlayer(vpContainer);
					iWin.player.once('AdStopped', function() {
						vpPushdown.stopped();
					});
					iWin.player.load(vpContainer.getAttribute('data-vpurl'))
						.then(function startAd() {
							vpPushdown.ready();
						})
						.catch(function(reason) {
							vpPushdown.error(reason);
						});
				},
				'ready': function() {
					var iDoc = $adFrame.contents()[0],
						iWin = iDoc.defaultView;

					// Mute the player initially
					iWin.player.adVolume = 0;

					// Unmute/mute on mouse over
					$pushdownContainer.on('mouseover', function() {
						iWin.player.adVolume = 1;
					});
					$pushdownContainer.on('mouseout', function() {
						iWin.player.adVolume = 0;
					});

					$pushdownContainer.trigger('cmls.display', function() {
						iWin.player
							.startAd()
							.then(function() {
								log('VAST player playing.');
								$timerDiv.trigger(
									'cmls.start',
									iWin.player.adDuration * 1000
								);
							});
					});
				},
				'stopped': function() {
					log('VAST player stopped.');
					$pushdownContainer.trigger('cmls.hide');
				},
				'error': function(reason) {
					log('Error from VAST player', reason);
					$pushdownContainer.trigger('cmls.hide');
				}
			};
			window._CMLS.vpPushdown = vpPushdown;

			var lib = $adFrame.contents()[0].createElement('script');
				lib.onload = vpPushdown.init;
				lib.src = 'https://cdn.jsdelivr.net/npm/vast-player@latest/dist/vast-player.min.js';
			$adFrame.contents()[0].body.appendChild(lib);
		}

		var handleCreative = {
			"image": handleImage,
			"video": handleVideo,
			"vast": handleVast
		};

		function checkRenderEvent(e) {
			if (e.slot.getSlotElementId() === elementId) {
				log('Caught relevant DFP render event.', e.slot.getSlotElementId());
				if (e.isEmpty) {
					log('Slot was empty!');
					$pushdownContainer.trigger('cmls.hide');
					return false;
				}
				
				log('Handling ad.');
				var $adFrame = $pushdownContainer.find('iframe:first');

				if (!$adFrame.length) {
					log('Attempted to handle ad, but no DFP iframe was found.');
					return false;
				}

				var adType = detectCreative($adFrame);
				if (!adType) {
					log('No supported ad creative type found.');
					return false;
				}

				log('Ad type detected.', adType);
				handleCreative[adType]($adFrame);
			}
		}
		googletag.pubads().addEventListener('slotRenderEnded', function(e) {
			debounce(checkRenderEvent(e), 500);
		});

		log('Injecting ad tag.');
		googletag.defineSlot(adPath, [1020,574], elementId)
			.setCollapseEmptyDiv(true)
			.setTargeting('pos', 'pushdown')
			.addService(googletag.pubads());

		$placement.prepend($pushdownContainer);

	});

}(jQuery, window.self));