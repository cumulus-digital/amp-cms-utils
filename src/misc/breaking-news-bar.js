/**
 * Breaking News Banner
 * Injects a breaking news banner above or below the masthead with specified options.
 *
 * SIMPLE USAGE:
 * <script>
 * parent._CMLSBreakingNews = parent._CMLSBreakingNews || [];
 * parent._CMLSBreakingNews.push('Text to display in bar', 'http://example.com');
 * </script>
 *
 * ADVANCED USAGE:
 * <script>
 * parent._CMLSBreakingNews = parent._CMLSBreakingNews || [];
 * parent._CMLSBreakingNews.push({
 * 	position: 'below',
 * 	beforeText: 'Not So Breaking News:',
 * 	text: 'This is a more advanced usage which allows more options. It <a href="http://example.com" target="_blank">supports HTML</a>.'
 * });
 * </script>
 */
(function($, window, undefined) {
	var _CMLS = window._CMLS || {};
	_CMLS.breakingNews = function(options, link) {
		var defaults = {
			position: 'above',
			link: null,
			beforeText: 'Breaking News:',
			text: null
		}, settings, injectionPoint = '.wrapper-header';

		if (typeof options === "object") {
			settings = $.extend({}, defaults, options);
		} else {
			settings = defaults;
			settings.text = options;
		}

		if ( ! settings.link && link) {
			settings.link = link;
		}

		var stylesheet = '' +
			'.cmlsBreakingNews-container { display: block; position: relative; float: none; z-index: 10; padding: 1em; color: #fff; background: #900; box-shadow: 0 0 10px rgba(0,0,0,0.4); font-size: 14px; text-decoration: none; outline: 0 }' +
			'.cmlsBreakingNews-container[href] { cursor: pointer; }' +
			'.cmlsBreakingNews-container:hover { color: #fff !important; }' +
			'.cmlsBreakingNews-inner { max-width: 1020px; margin: 0 auto; }' +
			'.cmlsBreakingNews-before { font-weight: bold; display: inline-block; }' +
			'.cmlsBreakingNews-inner a { text-decoration: underline !important; color: inherit; }';

		var template = '<div class="cmlsBreakingNews-container"><div class="cmlsBreakingNews-inner">{{BEFORE}} {{TEXT}}</div></div>';

		if (settings.beforeText && settings.beforeText.length) {
			var before = '<div class="cmlsBreakingNews-before">' + settings.beforeText + '</div>';
			template = template.replace('{{BEFORE}}', before);
		}

		template = $(template.replace('{{TEXT}}', settings.text));

		if (settings.link && settings.link.length) {
			console.log('Setting bar link.');
			var newTemplate = $('<a class="cmlsBreakingNews-container"></a>').append(template.html()).prop({
				href: settings.link,
				target: "_blank"
			});
			template = newTemplate;
		}

		if ( ! $('#cmlsBreakingNewsStyles').length) {
			$('head').prepend("<style id=\"cmlsBreakingNewsStyles\">/* CMLS Breaking News Bar styles */\n" + stylesheet + '</style>');
		}
		if (settings.position === 'below') {
			$(injectionPoint).after(template);
			return;
		}

		$(injectionPoint).before(template);
	};

	var BNInjector = function() {};
	BNInjector.prototype = [];
	BNInjector.prototype.push = function() {
		_CMLS.breakingNews.apply(null, arguments);
	};

	if (window._CMLSBreakingNews && window._CMLSBreakingNews.length) {
		window._CMLSBreakingNews.forEach(_CMLS.breakingNews);
	}
	window._CMLSBreakingNews = new BNInjector();

}(jQuery, window));