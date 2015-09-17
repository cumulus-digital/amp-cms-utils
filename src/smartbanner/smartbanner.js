/* globals ga */
(function(window, undefined) {
	
	var v = '0.5';

	// Cookie read/write helpers
	var cookies = {
		read: function(key) {
			return(document.cookie.match('(^|; )'+key+'=([^;]*)')||0)[2];
		},
		set: function(key, value, exp) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate()+exp);
			value = encodeURI(value) + ( ! exp ?  '' : '; expires=' + exdate.toUTCString() );
			document.cookie = key + '=' + value + '; path=/';
		}
	};

	function log() {
		if (window._CMLS && window._CMLS.debug && typeof console === 'object' && console.log) {
			console.log('[SMART APP BANNER ' + v + ']', [].slice.call(arguments));
		}
	}

	// Library attaches to corp namespace
	window._CMLS = window._CMLS || {};
	window._CMLS.smartBanner = function(options) {
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
			daysToHide: 30
		};
		var settings, vendor, banner, bannerTemplate;

		function extend(obj1, obj2) {
			var newObj = Object.create(obj1);
			Object.keys(obj2).map(function(p) {
				if (p in newObj) {
					newObj[p] = obj2[p];
				}
			});
			return newObj;
		}

		settings = extend(defaults, options);
		log('Loaded with settings', settings);

		// Constants
		var APPLE = 'apple',
			GOOGLE = 'google';

		bannerTemplate = '' +
			'<i id="cmls-sb-close">&times;</i>' +
			'<div id="cmls-sb-icon"></div>' +
			'<div id="cmls-sb-info">' +
				'<div id="cmls-sb-title"></div>' +
				'<div id="cmls-sb-author"></div>' +
				'<div id="cmls-sb-instore"></div>' +
			'</div>' +
			'<a href="#" id="cmls-sb-link">' + settings.strings.button + '</a>';

		/**
		 * Retrieve device type from UA string
		 */
		function getDevice() {
			var ua = typeof userAgent !== 'undefined' ? userAgent : navigator.userAgent; // jshint ignore:line
			// Strip Facebook's crap
			// pulled from https://github.com/kaimallea/isMobile
			var fb = ua.split('[FBAN');
			if (typeof fb[1] !== 'undefined') {
				ua = fb[0];
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
				}
			];
			for (var i = 0; i < maps.length; i++) {
				if (ua.match(maps[i].regexp)) {
					return maps[i].vendor;
				}
			}
			return false;
		}

		/**
		 * Retrieve app ID from meta tag for a given store
		 * @param  {string} store         store to look for
		 * @return {string|undefined}     ID string or undefined
		 */
		function getMetaId(store) {
			log('Retrieving app ID for ' + store);
			var meta, content, id;
			switch(store) {
				case APPLE:
					meta = window.document.querySelector('meta[name="apple-itunes-app"]');
					break;
				case GOOGLE:
					meta = window.document.querySelector('meta[name="google-play-app"]');
					break;
			}
			if (meta) {
				content = meta.getAttribute('content');
				if (content && content.length) {
					id = /app-id=([^\s,]+)/i.exec(content);
					if ( ! id || ! id.length) {
						id = undefined;
					}
					return id[1];
				}
			}
			return undefined;
		}

		/**
		 * Generates a store URL for a given store and app ID
		 * @param  {string} store store type
		 * @param  {string} id    app id
		 * @return {string}       URL to app in store
		 */
		function getStoreLink(store, id) {
			var base = {};
				base[APPLE] = 'https://itunes.apple.com/en/app/id';
				base[GOOGLE] = 'https://play.google.com/store/apps/details?id=';
			log('Fetching store URL', store, id, base[store]);
			if (base[store]) {
				return base[store] + id;
			}
			return undefined;
		}

		/**
		 * Fetch the icon url from settings or touch-icon link tag
		 */
		function getIcon() {
			if (settings.icon.url) {
				return settings.icon.url;
			}
			var link = window.document.querySelector('link[rel="apple-touch-icon"],link[rel="android-touch-icon"]');
			if (link) {
				return link.getAttribute('href');
			}
			return null;
		}

		/**
		 * Fetch the app title from settings or doc title
		 */
		function getTitle() {
			if (settings.title) {
				return settings.title;
			}
			return window.document.title;
		}

		banner = {
			cache: {
				htmlPaddingTop: window.document.documentElement.style.paddingTop
			},
			template: 
				'<div id="' + settings.containerId + '">' +
					'<i id="cmls-sb-close">&#10005;</i>' +
					'<div id="cmls-sb-icon"></div>' +
					'<div id="cmls-sb-info">' +
						'<div id="cmls-sb-title"></div>' +
						'<div id="cmls-sb-author"></div>' +
						'<div id="cmls-sb-instore"></div>' +
					'</div>' +
					'<a href="#" id="cmls-sb-link">' + settings.strings.button + '</a>' +
				'</div>',
			
			/**
			 * Closes the banner and restores document to initial state
			 */
			close: function() {
				if (typeof ga !== 'undefined') {
					ga('send', 'event', 'Smart App Banner', 'Closed Banner');
				}
				this.cache.container.className = this.cache.container.className.replace('cmls-sb-open', '') + ' cmls-sb-closed';
				window.document.documentElement.className = window.document.documentElement.className.replace('cmls-sb-injected', '');
				cookies.set('smartbanner-closed', 'true', settings.daysToHide);
			},

			launchStore: function(vendor, e) {
				if (typeof ga !== 'undefined') {
					ga('send', 'event', 'Smart App Banner', 'Launched Store', vendor, {'hitCallback': function() {
						window.document.location = e.target.href;
					}});
					return;
				}
				window.document.location = e.target.href;
			},

			/**
			 * Builds and initializes the banner
			 * @param  {string} vendor   device vendor string
			 * @return {nodeList}        compiled banner
			 */
			init: function init(vendor) {
				var frag = document.createDocumentFragment(),
					container = document.createElement('div');

				container.innerHTML = this.template;
				frag.appendChild(container);

				frag.querySelector('#'+settings.containerId).className = 'cmls-sb-' + vendor;

				frag.querySelector('#cmls-sb-icon').style.backgroundColor = settings.icon.color;
				frag.querySelector('#cmls-sb-icon').style.backgroundImage = 'url("' + getIcon() + '")';
				frag.querySelector('#cmls-sb-title').innerHTML = getTitle();
				if (settings.author) {
					frag.querySelector('#cmls-sb-author').innerHTML = settings.author;
				} else {
					frag.querySelector('#cmls-sb-author').parentNode.removeChild(frag.querySelector('#cmls-sb-author'));
				}
				frag.querySelector('#cmls-sb-instore').innerHTML = settings.strings.price[vendor] + ' &ndash; ' + settings.strings.store[vendor];
				frag.querySelector('#cmls-sb-link').href = getStoreLink(vendor, getMetaId(vendor));
				frag.querySelector('#cmls-sb-link').setAttribute('data-app-store', vendor);

				var closeButton = frag.querySelector('#cmls-sb-close'),
					linkButton = frag.querySelector('#cmls-sb-link');

				var _this = this;
				closeButton.addEventListener('click', function(){ _this.close(); }, false);
				closeButton.addEventListener('touchend', function(){ _this.close(); }, false);

				linkButton.addEventListener('click', function(e){ _this.launchStore(vendor, e); }, false);
				linkButton.addEventListener('touchend', function(e){ _this.launchStore(vendor, e); }, false);

				return frag.firstChild.firstChild;
			},

			inject: function(banner) {
				window.document.body.appendChild(banner);
				this.cache.container = window.document.getElementById(banner.id);
				this.cache.containerHeight = this.cache.container.offsetHeight;
				log('Discovered banner height', this.cache.containerHeight);

				var html = window.document.documentElement;
				html.className = html.className + ' cmls-sb-injected';
				this.cache.htmlPaddingTop = html.style.paddingTop;
				//html.style.paddingTop = this.cache.containerHeight + 'px';

				this.cache.container.className = this.cache.container.className + ' cmls-sb-open';
			}
		};

		vendor = getDevice();
		log('Detected device', vendor ? vendor : 'unsupported');

		if (
			! vendor ||
			navigator.standalone ||
			cookies.read('smartbanner-closed') ||
			cookies.read('sb-closed') ||
			cookies.read('smartbanner-installed')
		) {
			log('Not supported or closed cookie found, ejecting.');
			return;
		}

		log('Generating banner');
		var bannerNode = banner.init(vendor);

		log('Injecting!');
		banner.inject(bannerNode);
	};

}(window));