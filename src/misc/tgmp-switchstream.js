/**
 * Easily create a button that switches the TGMP stream
 * by adding classes to an element.
 *
 * Classes:
 * 	tgmp-switchstream: Enables the action
 * 	tgmp-streamid-xxxx: Stream ID to switch to (change "xxxx")
 * 	tgmp-autostart: OPTIONAL. Automatically start playing when clicked.
 *  tgmp-theme-######: OPTIONAL. Theme color to apply, 6 digits.
 * 
 * Example:
 *
 * <a href="#" class="tgmp-switchstream tgmp-streamid-wxyz tgmp-theme-550000 tgmp-autostart">Switch Stream</a>
 * 
 */
(function($, window, undefined) {
	window._CMLS = window._CMLS || {};

	var scriptName = 'SWITCHSTREAM LINKS',
		version = '0.16';

	function log() {
		if (window._CMLS && window._CMLS.logger) {
			window._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	function parseCommand(id, autostart, theme) {
		var opts = { brand: id, autostart: false };
		if (theme && /\d+/.test(theme)) {
			opts.theme = [ '#' + theme ];
		}
		if (autostart) {
			opts.autostart = true;
		}
		return opts;
	}

	window._CMLS.switchTGMPStream = function(id, autostart, theme) {
		var tgmp = window.tgmp || window.top.tgmp || null,
			opts = parseCommand(id, autostart, theme);

		if (tgmp) {
			log('Switching stream', opts);
			tgmp.update(opts);
		}
	};

	log('Initializing switchstream links on page.');

	$(function(){

		// Selectors for switch stream delegation
		var switchSelectors = 
			'.tgmp-switchstream,' +
			'img[alt*="tgmp-switchstream"],' +
			'a[alt*="tgmp-switchstream"],' +
			'a[href*="tgmp-switchstream"]';

		$(switchSelectors).each(function() {
			var $this = $(this),
				alt = $this.prop('alt'),
				href = $this.prop('href'),
				commands = { 'brand': null, 'theme': null, 'autostart': false };

			function getVars(vars) {
				log('Requested vars', vars);
				return {
					'brand': vars.indexOf('tgmp-streamid') > -1 ? vars.match(/tgmp\-streamid\-(\w+)/i)[1] : null,
					'theme': vars.indexOf('tgmp-theme') > -1 ? ['#' + vars.match(/tgmp\-theme\-([a-z0-9]+)/i)[1] ] : null,
					'autostart': vars.indexOf('tgmp-autostart') > -1 ? true: false
				};
			}

			if ($this.hasClass('tgmp-switchstream')) {
				var classes = $this.prop('class');
				log('Using element classes', classes);
				commands = getVars(classes);
			}

			if (alt && alt.indexOf('tgmp-switchstream') > -1) {
				log('Using element alt attribute', alt);
				commands = getVars(alt);
			}

			if (href && href.indexOf('tgmp-switchstream') > -1) {
				log('Using element href', href);
				commands = getVars(href);
			}

			if ( ! commands.brand || commands.brand.length < 2) {
				log('No brand provided, exiting.');
				return false;
			}

			$this.data('tgmp-switchstream', commands);

		}).on('click.cmls-tg-switchstream', function(e) {
			e.preventDefault();
			var $this = $(this),
				command = $this.data('tgmp-switchstream'),
				tgmp = window.tgmp || window.top.tgmp || null;

			if ( ! command) {
				log('Link was not initialized, exiting');
				return;
			}

			if ( ! tgmp) {
				log('TGMP not available!');
				return;
			}

			log('Switching stream', command);
			tgmp.update(command);
		});

	});
}(jQuery, window.self));