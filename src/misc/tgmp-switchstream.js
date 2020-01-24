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
		version = '0.6';

	function log() {
		if (window._CMLS && window._CMLS.logger) {
			window._CMLS.logger(scriptName + ' v' + version, arguments);
		}
	}

	window._CMLS.switchTGMPStream = function(id, autostart, theme) {
		var tgmp = window.tgmp || window.top.tgmp || null,
			opts = { brand: id, autostart: false };
		if (autostart) {
			opts.autostart = true;
		}
		if (theme && /\d+/.test(theme)) {
			opts.theme = [ '#' + theme ];
		}
		if (tgmp) {
			log('Switching stream', opts);
			tgmp.update(opts);
		}
	};

	log('Initializing switchstream links on page.');

	$(function(){

		function switchStream(e) {
			log('Intercepted click', this);
			var classes = this.className, alt = this.getAttribute('alt'),
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

			log('Got switchstream link', this, commands);

			if (commands.streamid && commands.streamid.length < 2) {
				log('No stream ID provided, exiting.', commands.streamid, commands.streamid.length);
				return false;
			}

			commands.streamid = commands.streamid[1];
			e.preventDefault();
			window._CMLS.switchTGMPStream(
				commands.streamid,
				commands.autostart,
				commands.theme
			);
		}

		// Selectors for switch stream delegation
		var switchselector = '.tgmp-switchstream,img[alt*="tgmp-switchstream"],a[alt*="tgmp-switchstream"]';
		$('body')
			.off('click.cmls-tg-switchstream', switchselector, switchStream)
			.on('click.cmls-tg-switchstream', switchselector, switchStream);
	});
}(jQuery, window.self));