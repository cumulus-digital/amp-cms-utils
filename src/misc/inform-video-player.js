/**
 * Inform video injector
 * Received DPID (Inform's market ID) from local container
 * and injects Inform's player initializer
 * 
 * Local usage:
 * window._informinjector.push({
 *	id: '1234'
 * });
 */
(function($, window, undefined){
	var scriptName = 'INFORM INJECTOR',
		nameSpace = 'informInjector',
		version = '0.1';

	function log() {
		if (window.top._CMLS && window.top._CMLS.logger) {
			return window.top._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	// Make sure we're on a post
	if (
		window.document.body.className.indexOf('single-feed_posts') < 0 &&
		window.document.body.className.indexOf('single-post') < 0
	) {
		log('Not a post, ejecting.');
		return false;
	}

	/**
	 * Returns a post ID for the current page,
	 * or false if this is not a post page
	 */
	function getPostId() {
		var postId = window.document.body.className.match(/postid\-(\d+)/);
		if (postId && postId.length > 1 && parseInt(postId[1], 10)) {
			return postId[1];
		}
		return false;
	}

	function InformInjector() {

		var informTemplate = '<div class="ndn_embed" id="{POS_ID}" data-config-distributor-id="{DPID}" data-config-width="100%" data-config-aspect-ratio="16:9"></div><script type="text/javascript">var _informq = _informq || []; _informq.push(["embed"]);</scr' + 'ipt>';

		/**
		 * Returns a formatted Inform embed template
		 * @param   id     int    Inform DPID
		 * @param   pos    string Position indicator string
		 * @returns string
		 */
		function getTemplate(id, pos){
			if ( ! id) {
				log('getTemplate called without DPID');
				return false;
			}
			if ( ! pos) {
				pos = 'inform-pp-top';
			}
			var template = informTemplate
							.replace('{POS_ID}', pos)
							.replace('{DPID}', id);
			return template;
		}

		/**
		 * Injects inform video embeds
		 * @param id int Inform DPID
		 * @return boolean
		 */
		function inject(id){
			if ( ! id) {
				log('Inject called without DPID.');
				return false;
			}
			var postId = getPostId();
			if (postId === false) {
				log('Could not retrieve post ID while injecting', id);
				return false;
			}
			// Retrieve P tags in article
			var pTags = $('article#post-' + postId + ' .entry-content > p:not(.read-more-full-link)');
			if (pTags.length) {
				if (pTags.length > 1) {
					pTags.first().after(getTemplate(id, 'inform-pp-top'));
				} else {
					log('Not enough p tags to inject top embed.');
				}
				if (pTags.length > 3) {
					pTags.last().before(getTemplate(id, 'inform-pp-bottom'));
				} else {
					log('Not enough p tags to inject bottom embed.');
				}
				return true;
			}
		}

		/**
		 * Receives an object in the format
		 * { id: int }
		 */
		function _process(options){
			try {
				if ( ! options || ! options.id) {
					throw {message: 'Invalid request, no ID', data: options};
				}
				log('Received request to inject Inform embed with ID ' + options.id);

				inject(options.id);
			} catch(e) { log('Failed', e); }
		}
		this.process = _process;

		log('Initializing InformInjector array handler.');

		var InformArray = function(){};
		InformArray.prototype = [];
		InformArray.prototype.push = function(){
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i].id) {
					$(_process(arguments[i]));
				}
			}
		};

		// Handle any existing requests that came before library loaded
		if (window._informinjector && window._informinjector.length) {
			log('Found existing requests, processing.', window._informinjector);
			for (var i = 0; i < window._informinjector.length; i++) {
				_process(window._informinjector[i]);
			}
		}

		// Reassign our fake array for future requests
		window._informinjector = new InformArray();
		log('Listening for future requests.');

	}

	// Remove any existing inform base script
	$('script#informbase').remove();

	// Inject new inform base script
	$('<script type="text/javascript" src="//launch.newsinc.com/js/embed.js"></scr' + 'ipt>').appendTo('head');

	// Start the injector
	window._CMLS = window._CMLS || {};
	window._CMLS[nameSpace] = new InformInjector();

	log('Initialized.');

}(jQuery, window.self));