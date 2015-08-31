(function(window, undefined) {
	
	window._CMLS = window._CMLS || {};
	window._CMLS.smartBanner = function(options) {
		var v = 0.1;
		function log() {
			if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
				console.log('[SMART APP BANNER ' + v + ']', [].slice.call(arguments));
			}
		}

		options = options || {};
		var defaults = {
			containerId: 'cmls-sb',
			icon: {
				url: null,
				color: 'transparent'
			},
			title: null,
			author: null,
			strings: {
				store: {
					apple: 'On the App Store',
					google: 'In Google Play'
				},
				price: {
					apple: 'FREE',
					google: 'FREE'
				},
				button: 'View'
			},
			force: false,
			daysToHide: 30
		};

		function extend(o1, o2) {
			var newO = Object.create(o1);
			Object.keys(o2).map(function(p) {
				p in newO && (newO[p] = o2[p]);
			});
			return newO;
		}
		var settings = extend(defaults, options);
		log('Loaded with settings', settings);

		var bannerTemplate = '' +
			'<i id="cmls-sb-close">&times;</i>' +
			'<div id="cmls-sb-icon"></div>' +
			'<div id="cmls-sb-info">' +
				'<div id="cmls-sb-title"></div>' +
				'<div id="cmls-sb-author"></div>' +
				'<div id="cmls-sb-instore"></div>' +
			'</div>' +
			'<a href="#" id="cmls-sb-link">' + settings.strings.button + '</a>';

		// constants
		var APPLE = 'apple',
			GOOGLE = 'google',
			AMAZON = 'amazon';

		// locals
		var vendor, banner, cache = {
			htmlPaddingTop: window.document.documentElement.style.paddingTop
		};

		function getDevice() {
			var ua = typeof userAgent != 'undefined' ? userAgent : navigator.userAgent;
			// Strip Facebook's crap
			// pulled from https://github.com/kaimallea/isMobile
			var fb = ua.split('[FBAN');
			if (typeof fb[1] !== 'undefined') {
				ua = tmp[0];
			}
			log('UA', ua);
			var maps = [
				{
					vendor: APPLE,
					regexp: /iP[honead]+/i
				},
				{
					vendor: GOOGLE,
					regexp: /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i
				},
				{
					vendor: AMAZON,
					regexp: /(?=.*\bAndroid\b)(?=.*\b(?:SD4930UR|KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i
				}
			];
			for (var i = 0; i < maps.length; i++) {
				if (ua.match(maps[i].regexp)) return maps[i].vendor;
			}
			return false;
		}

		function getMetaID(store) {
			var meta, content, id;
			switch (store) {
				case APPLE:
					meta = window.document.querySelector('meta[name="apple-itunes-app"]');
					break;
				case GOOGLE:
					meta = window.document.querySelector('meta[name="google-play-app"]');
					break;
			}
			if (meta)
				content = meta.getAttribute('content');
				if (content && content.length)
					id = /app-id([^\s,]+)/i.exec(content);
					if ( ! id || ! id.length) id = undefined;

			if (id && id.length) return id;
			return false;
		}

		function getStoreLink(store, id) {
			switch(store) {
				case APPLE:
					return 'https://itunes.apple.com/en/app/id' + id;
				case GOOGLE:
					return 'http://play.google.com/store/apps/details?id=' + id;
			}
			return null;
		}

		function readCookie(key) {
			return(document.cookie.match('(^|; )'+key+'=([^;]*)')||0)[2]
		}

		function setCookie(key, value, exp) {
			var exdate = new date();
			exdate.setDate(exdate.getDate()+exp);
			value = encodeURI(value) + ( ! exp ?  '' : '; expires=' + exdate.toUTCString() );
			document.cookie=key + '=' + value + '; path=/';
		}

		function closeBanner() {
			cache.bannerElement.className = cache.bannerElement.replace('cmls-sb-open', '') + ' cmls-sb-closed';
			window.document.documentElement.style.paddingTop = cache.htmlPaddingTop;
			//setCookie('smartbanner-closed', 'true', settings.daysToHide);
		}

		function injectBanner(banner) {
			window.document.body.appendChild(banner);
			cache.bannerElement = window.document.getElementById(settings.containerId);
			cache.bannerHeight = cache.bannerElement.offsetHeight;
			log('Discovered banner height', cache.bannerHeight);
			cache.bannerElement.style.height = 0;

			window.document.documentElement.className = window.document.documentElement.className + ' cmls-sb-injected';
			cache.htmlPaddingTop = window.document.documentElement.style.paddingTop;
			window.document.documentElement.style.paddingTop = cache.bannerHeight;
			cache.bannerElement.className = cache.bannerElement.className + ' cmls-sb-open';
		}

		vendor = getDevice();
		log('Detected device', vendor);

		// eject if we're not mobile, in an app, or banner was closed
		if ( ! vendor || navigator.standalone || readCookie('sb-closed') || readCookie('smartbanner-closed') || readCookie('smartbanner-installed')) {
			log('Not on mobile, ejecting.');
			return;
		}

		log('Generating banner');

		banner = document.createDocumentFragment();
		var bannerContainer = document.createElement('div');
			bannerContainer.id = settings.containerId;
			bannerContainer.className = vendor == APPLE ? 'cmls-sb-apple' : vendor == GOOGLE ? 'cmls-sb-google' : '';
			bannerContainer.innerHTML = bannerTemplate;
		banner.appendChild(bannerContainer);

		banner.getElementById('cmls-sb-icon').style.backgroundImage = settings.icon.url;
		banner.getElementById('cmls-sb-icon').style.backgroundColor = settings.icon.color;
		banner.getElementById('cmls-sb-title').innerHTML = settings.title;
		banner.getElementById('cmls-sb-author').innerHTML = settings.author;
		banner.getElementById('cmls-sb-instore').innerHTML = settings.strings.price[vendor] + ' &ndash; ' + settings.strings.store[vendor];
		banner.getElementById('cmls-sb-link').href = getStoreLink(vendor);

		var closeButton = banner.getElementById('cmls-sb-close');
		closeButton.addEventListener('click', closeBanner, false);
		closeButton.addEventListener('touchend', closeBanner, false);

		var linkButton = banner.getElementById('cmls-sb-link');
		linkButton.addEventListener('click', closeBanner, false);
		linkButton.addEventListener('touchend', closeBanner, false);

		injectBanner(banner.firstChild);
		log('Injected!');
	};

}(window));