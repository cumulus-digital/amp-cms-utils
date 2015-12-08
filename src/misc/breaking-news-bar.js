/**
 * Breaking News Banner
 * Injects a breaking news banner above or below the masthead with specified options.
 *
 * SIMPLE USAGE:
 * <script>
 * parent._CMLSBreakingNews = parent._CMLSBreakingNews || [];
 * parent._CMLSBreakingNews.push(['Text to display in bar', 'http://example.com']);
 * </script>
 *
 * ADVANCED USAGE:
 * <script>
 * parent._CMLSBreakingNews = parent._CMLSBreakingNews || [];
 * parent._CMLSBreakingNews.push({
 * 	position: 'below',
 * 	background: '#349',
 * 	beforeText: 'Not So Breaking News:',
 * 	text: 'This is a more advanced usage which allows more options. It <a href="http://example.com" target="_blank">supports HTML</a>.'
 * });
 * </script>
 */
(function($, window, undefined) {

	var scriptName = 'BREAKING NEWS BAR',
		nameSpace = 'BreakingNews',
		version = '0.7';

	var _CMLS = window._CMLS || {};

	function log() {
		_CMLS.logger(scriptName + ' v' + version, arguments);
	}

	if (!Array.isArray) {
		Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}

	_CMLS[nameSpace] = function(options, link) {

		log('Called', typeof options, options, link);

		var defaults = {
			classPrefix: 'cmlsBreakingNews',
			additionalClass: '',
			position: 'above',
			link: null,
			beforeText: 'Breaking News:',
			text: null,
			background: '#900',
			color: '#fff'
		}, settings, injectionPoint = '.wrapper-header';

		if (typeof options === "object" && ! Array.isArray(options)) {
			settings = $.extend({}, defaults, options);
			log('Advanced mode!');
		} else if (typeof options === "object" && Array.isArray(options) && options.length) {
			settings = defaults;
			settings.text = options[0];
			if (options.length > 1) {
				link = options[1];
			}
			log('Basic mode!');
		} else if (typeof options !== "object") {
			settings = defaults;
			settings.text = options;
			log('Basic mode!');
		} else {
			log('Invalid usage!', options, link);
			return;
		}

		if ( ! settings.link && link) {
			settings.link = link;
		}

		log('Settings:', settings);

		var stylesheet = '' +
			'.' + settings.classPrefix + '-container { display: block; box-sizing: border-box; position: relative; float: none; overflow: hidden; z-index: 10; padding: 1em; color: ' + settings.color + '; background: ' + settings.background + '; box-shadow: 0 0 10px rgba(0,0,0,0.4); font-size: 14px; line-height: 1.2; text-decoration: none; outline: 0 }' +
			'.' + settings.classPrefix + '-container[href] { cursor: pointer; }' +
			'.' + settings.classPrefix + '-container[href]:hover .' + settings.classPrefix + '-before { text-decoration: underline; }' +
			'.' + settings.classPrefix + '-container:hover { color: ' + settings.color + ' !important; }' +
			'.' + settings.classPrefix + '-inner { box-sizing: border-box; max-width: 1020px; margin: 0 auto; }' +
			'.' + settings.classPrefix + '-before { float: left; font-weight: bold; margin-right: .5em; }' +
			'.' + settings.classPrefix + '-text { overflow: hidden; }' +
			'.' + settings.classPrefix + '-inner a { text-decoration: underline !important; color: inherit; }';

		var template = '<div class="' + settings.classPrefix + '-container"><div class="' + settings.classPrefix + '-inner">{{BEFORE}}<div class="' + settings.classPrefix + '-text">{{TEXT}}</div></div></div>';

		if (settings.beforeText && settings.beforeText.length) {
			var before = '<div class="' + settings.classPrefix + '-before">' + settings.beforeText + '</div>';
			template = template.replace('{{BEFORE}}', before);
		}

		template = $(template.replace('{{TEXT}}', settings.text));

		if (settings.link && settings.link.length) {
			var newTemplate = $('<a class="' + settings.classPrefix + '-container"></a>').append(template.html()).prop({
				href: settings.link,
				target: "_blank"
			});
			template = newTemplate;
		}

		$('#cmlsBreakingNewsStyles').remove();
		$('head').append("<style id=\"cmlsBreakingNewsStyles\">/* CMLS Breaking News Bar styles */\n" + stylesheet + '</style>');
		if (settings.position === 'below') {
			$(injectionPoint).after(template);
			return;
		}

		$(injectionPoint).before(template);
	};

	var BNInjector = function() {};
	BNInjector.prototype = [];
	BNInjector.prototype.push = function() {
		log('Received after-load request.', arguments);
		_CMLS[nameSpace].apply(null, arguments);
	};

	if (window['_CMLS' + nameSpace] && window['_CMLS' + nameSpace].length) {
		window['_CMLS' + nameSpace].forEach(_CMLS[nameSpace]);
	}
	window['_CMLS' + nameSpace] = new BNInjector();

}(jQuery, window));