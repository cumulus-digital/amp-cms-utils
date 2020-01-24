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
		version = '0.11';

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

		function switchStream(e) {
			log('Intercepted click', this);
			var classes = this.className,
				alt = this.getAttribute('alt'),
				href = this.href,
				commands = { 'streamid': null, 'theme': null, 'autostart': false };

			function getVars(vars) {
				log('Requested vars', vars);
				return {
					'streamid': vars.match(/tgmp\-streamid\-(\w+)/i),
					'theme': vars.indexOf('tgmp-theme') > -1 ? vars.match(/tgmp\-theme\-(\d+)/i)[1] : null,
					'autostart': vars.indexOf('tgmp-autostart') > -1 ? true : false
				};
			}
			if (classes && classes.indexOf('tgmp-switchstream') > -1) {
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

			log('Got switchstream link', this, commands);

			if (commands.streamid && commands.streamid.length < 2) {
				log('No stream ID provided, exiting.', commands.streamid, commands.streamid.length);
				return false;
			}

			commands.streamid = commands.streamid[1];
			var tgmp = window.tgmp || window.top.tgmp || null;
			if (tgmp) {
				tgmp.update(parseCommand(
					commands.streamId,
					commands.autostart,
					commands.theme
				));
			}

			e.preventDefault();
		}

		// Selectors for switch stream delegation
		var switchselectors = 
			'.tgmp-switchstream,' +
			'img[alt*="tgmp-switchstream"],' +
			'a[alt*="tgmp-switchstream"],' +
			'a[href*="tgmp-switchstream"]';

		$('body')
			.off('click.cmls-tg-switchstream', switchselectors, switchStream)
			.on('click.cmls-tg-switchstream', switchselectors, switchStream);
	});
}(jQuery, window.self));