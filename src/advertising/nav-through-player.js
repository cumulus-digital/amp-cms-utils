/**
 * Searches ad contents for local links that would normally interrupt the player
 * and alters them to load through the player instead.
 */
;(function($, window, undefined){
	
	var scriptName = "NAV THROUGH PLAYER",
		nameSpace = "navThroughPlayer",
		version = "0.2",
		_CMLS = window._CMLS,
		player = _CMLS.whichPlayer();

	function log() {
		_CMLS.log(scriptName + ' v' + version, arguments);
	}

	if (_CMLS[nameSpace]) {
		return;
	}

	function NavThroughPlayer(){
		var that = this;

		this.updateIframe = function(iframe){
			var $iframe = iframe.jquery ? iframe : $(iframe);
			$iframe.contents()
				.find('a[target="_self"], a[target="_top"], a[target="_parent"]')
					.each(function(){
						that.updateLink(this);
					});
		};

		this.updateLink = function(link, force){
			var $link = link.jquery ? link : $(link),
				l = window.document.createElement('a');

			l.href = $link.prop('href');

			if (
				l.href.indexOf('/') === 0 ||
				(l.hostname !== window.location.hostname && ! force)
			) {
				l = null;
				return;
			}

			$link
				.off('.' + nameSpace)
				.on('click.' + nameSpace, that.clickThrough);
			l = null;
		};

		this.clickThrough = function(e){
			log('Intercepting click.');
			if ( ! e.currentTarget || e.currentTarget.href) {
				log('Could not get href from target.');
				return;
			}

			var url = e.currentTarget.href;
			
			if (player.type === _CMLS.const.PLAYER_TRITON && window.History) {
				log('Navigating through Triton player.', url);
				window.History.pushState(null,null,url);
			} else if (player.type === _CMLS.const.PLAYER_TUNEGENIE && window.tgmp) {
				log('Navigating through TuneGenie player.', url);
				window.tgmp.updateLocation(url);
			} else {
				return;
			}
			e.preventDefault();
		};

		log('Initializing.');

		// When googletag is ready, start checking and updating iframes.
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push(function(){
			// Update existing iframes
			$('iframe[id^="google_ads_iframe"], #cmlsWallpaperInjectorContainer iframe').each(function(){
				that.updateIframe(this);
			});
			$(window).load(function(){
				$('iframe[id^="google_ads_iframe"], #cmlsWallpaperInjectorContainer iframe').each(function(){
					that.updateIframe(this);
				});				
			});

			// Update future iframes
			window.googletag.pubads.addEventListener('slotRenderEnded', function(e){
				if (e && e.slot) {
					var id = e.slot.getSlotElementId(),
						iframe = window.document.getElementById(id);
					that.updateIframe(iframe);
				}
			});

			log('Initialized.');
		});

		log('Passed to googletag init.');
	}

	/**
	 * Player may or may not be available at any given load event, so we need
	 * to continously check before instantiating.
	 */
	var check_count = 0;
	function checkForPlayer() {
		log('Checking for player, try:', check_count);
		player = _CMLS.whichPlayer();
		if (player.type) {
			log('Player found.');
			_CMLS[nameSpace] = new NavThroughPlayer();
			return;
		}
		if (check_count > 20) {
			log('Limit reached, ejecting.');
			return;
		}
		setTimeout(checkForPlayer, 1000);
		check_count++;
	}
	checkForPlayer();

}(jQuery, window));