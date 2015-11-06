/**
 * Searches ad contents for local links that would interrupt the player,
 * and alters them to load through the player.  Supports TG and Triton.
 */
(function($, window, undefined) {

	var scriptName = "NAV THROUGH PLAYER",
		nameSpace = "navThroughPlayer",
		version = "0.1",

		player = window._CMLS.whichPlayer();

	function log() {
		window._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	window._CMLS[nameSpace] = {
		isPlayerActive: function isPlayerActive() {
			if (player.type) {
				return true;
			}
			return false;
		},

		updateIframeLinks: function updateIframeLinks(iframe) {
			if ( ! window._CMLS[nameSpace].isPlayerActive) {
				return;
			}

			var $iframe = iframe.jquery ? iframe : $(iframe);
			log('Updating links in slot.', $iframe.prop('id'));
			$iframe.contents()
				.find('a[target="_self"],a[target="_top"],a[target="_parent"]')
					.each(function() {
						window._CMLS[nameSpace].updateLink(this);
					});
		},

		updateLink: function updateLink(link, force) {
			if ( ! window._CMLS[nameSpace].isPlayerActive) {
				return;
			}
			if (link.hostname !== window.location.hostname && ! force) {
				return;
			}

			var $link = link.jquery ? link : $(link);
			$link
				.off('.' + nameSpace)
				.on('click.' + nameSpace, window._CMLS[nameSpace].clickThrough);
		},

		clickThrough: function clickThrough(e) {
			if (e) {
				e.preventDefault();
			}
			log('Intercepting click.');
			window._CMLS[nameSpace].navigate(e.currentTarget.href);
		},

		navigate: function navigate(url) {
			// Triton player
			if (player.type === window._CMLS.const.PLAYER_TRITON && window.History) {
				log('Navigating through Triton player.', url);
				window.History.pushState(null,null,url);
			}
			// TuneGenie player
			if (player.type === window._CMLS.const.PLAYER_TUNEGENIE && window.top.tgmp) {
				log('Navigating through TuneGenie player.', url);
				window.top.tgmp.updateLocation(url);
			}			
		},

		init: function init() {
			if ( ! window._CMLS[nameSpace].isPlayerActive()) {
				log('No player is active, exiting.');
				return;
			}
			log('Initializing.');

			// Hook into DFP render event to update new ads
			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];
			window.googletag.cmd.push(function() {
				window.googletag.pubads().addEventListener('slotRenderEnded', function(e) {
					if (e && e.slot) {
						var id = e.slot.getSlotElementId(),
							iframe = window.document.getElementById(id);
						window._CMLS[nameSpace].updateIframeLinks(iframe);
					}
				});
			});

			// Update any existing ads on the page
			$('iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe').each(function() {
				window._CMLS[nameSpace].updateIframeLinks(this);
			});

			log('Initialized.');
		}
	};

	$(function() {
		window._CMLS[nameSpace].init();
	});

}(jQuery, window));