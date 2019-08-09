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

	if (window._CMLS[nameSpace]) {
		return;
	}

	window._CMLS[nameSpace] = {
		isPlayerActive: function isPlayerActive() {
			player = window._CMLS.whichPlayer();
			if (player.type) {
				return true;
			}
			return false;
		},

		updateIframeLinks: function updateIframeLinks(iframe) {
			if ( ! window._CMLS[nameSpace].isPlayerActive) {
				return;
			}

			if ( ! iframe) {
				log('Did not receive an iframe node, cannot update', iframe);
				return;
			}

			var $iframe = iframe.jquery ? iframe : $(iframe);
			
			// make sure we can access this iframe
			if (
				iframe.getAttribute('src') &&
				(
					iframe.getAttribute('src').indexOf(window.location.hostname) < 0 ||
					iframe.getAttribute('src').indexOf('/safeframe/') > 0
				)
			) {
				log('Ad iframe is in a safeframe, cannot update.', iframe);
				return;
			}
			
			try {
				$iframe.contents()
					.find('a[target="_self"],a[target="_top"],a[target="_parent"]')
						.each(function() {
							log('Updating links in slot.', $iframe.prop('id'), $iframe[0]);
							window._CMLS[nameSpace].updateLink(this);
						});
			} catch(e) {
				log('Could not update links in given iframe', iframe, e);
			}
		},

		updateLink: function updateLink(link, force) {
			if ( ! window._CMLS[nameSpace].isPlayerActive || ! link) {
				return;
			}

			var $link = link.jquery ? link : $(link),
				l = window.document.createElement('a');
				l.href = $link.prop('href');
			
			// Modify DFP clickthrough links with relative destination URLs
			// https://adclick.g.doubleclick.net/pcs/click?xai=AKAOjsuvjv8o-MlaMVicrisvj4oUF99EfgdZlQTft_qATngPo-agSxGvJJfpZIdv8lpTnPijPwvHFd1A63O55CPoXAXsiutchSikcVVlu0SRF0lcJAuJ0P8cMPDIMI2fH3pT_EO3VBcav_GBGmT7X1yl9PIZHTTMY34mCfLj1rwSRJvuIXARMXVeXzNdKLExKo41Xro_c4_7-oICux_fvv6X6BF_qo_9beWVsoKJCu4U8M1ZBZQIgXCLmpfsyw&sig=Cg0ArKJSzCv5yAsBtw7xEAE&urlfix=1&adurl=/2019/04/08/bbmas-t2w/
			// https://adclick.g.doubleclick.net/pcs/click?xai=AKAOjsvw4br-d0qrU4kyoGKAPTkjV23vKmjv5ZtUqiN5FUIvHvGUVsyzD3GIcTZwaWpzX7Iy8XG5ANHDFd4RZWl7mwQdzYOh-XuOnTdxtg93HIa8d4QvPClZthG8JVXTVq7XQ_m8lKJKjl-E5QIOzjG2y94ZHDvuwhmqeVxY7sXmSM2PZjnCM8KFQHwsgRAdpfXkgiaG0SlaKaeOD_9zJYryIzZf-6d3peddeDo54fDIhvJvz0IxM46aaPirng&sig=Cg0ArKJSzAlOWQms07awEAE&urlfix=1&adurl=http://www.test107.com//2019/04/08/bbmas-t2w/2019/04/08/bbmas-t2w/
			if (
				l.href.indexOf('doubleclick.net') !== -1 &&
				l.href.indexOf('adurl=/') !== -1
			) {
				log('Found a DFP clickthrough with a relative adurl!', l.href);
				var relURL;
				if ('URLSearchParams' in window) {
					var u = new window.URL(l.href),
						usr = new window.URLSearchParams(u.search);
					relURL = usr.get('adurl');
				} else {
					var vars = l.search.split('&');
					for (var i = 0, j = vars.length; i < j; i++) {
						var v = vars[i];
						if (v.indexOf('adurl=') > -1) {
							var pair = v.split('=');
							if (pair.length > 1) {
								relURL = pair[1];
								break;
							}
						}
					}
				}
				if (relURL) {
					l.href = l.href.replace('adurl=/', 'adurl=' + window.location.protocol + '//' + window.location.hostname + '/');
					$link.prop('href', l.href);
					log('Modified relative DFP clickthrough', relURL, l.href);
				} else {
					log('Could not parse query string in DFP clickthrough', relURL);
				}
			} else if (
				// Do not modify relative or off-domain URLs
				l.href.indexOf('/') === 0 || 
				(l.hostname !== window.location.hostname && ! force)
			) {
				log('Relative or off-site URL found, will not modify');
				l = null;
				return;
			}

			$link
				.off('.' + nameSpace)
				.on('click.' + nameSpace, window._CMLS[nameSpace].clickThrough);
			l = null;
		},

		clickThrough: function clickThrough(e) {
			if (e && window._CMLS[nameSpace].isPlayerActive()) {
				e.preventDefault();
			} else {
				return;
			}
			log('Intercepting click.');
			window._CMLS[nameSpace].navigate(e.currentTarget.href);
		},

		navigate: function navigate(url) {
			try {
				// Attempt to push events to GTM
				if (window.sharedContainerDataLayer) { window.sharedContainerDataLayer.push({'event': 'relative-ad-click', 'relativeAdURL': url}); }
				if (window.corpDataLayer) { window.corpDataLayer.push({'event': 'relative-ad-click', 'relativeAdURL': url}); }
			} catch(e){ console.log(e); }
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
			$(window).load(function() {
				$('iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe').each(function() {
					window._CMLS[nameSpace].updateIframeLinks(this);
				});
			});

			log('Initialized.');
		}
	};

	// Player may or may not be available at any load event we can hook to.
	// Continuously check until we reach a limit or a player becomes available.
	var check_count = 0;
	function checkForPlayer() {
		log('Checking for player...', check_count);
		if (window._CMLS[nameSpace].isPlayerActive()) {
			window._CMLS[nameSpace].init();
			return;
		}
		if (check_count > 20) {
			return;
		}
		setTimeout(checkForPlayer, 1000);
		check_count++;
	}
	checkForPlayer();

}(jQuery, window));