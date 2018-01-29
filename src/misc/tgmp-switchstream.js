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
		version = '0.1';

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
		$('.tgmp-switchstream').on('click', function(e){
			log('Intercepted click', this);
			var	classList = this.className,
				streamid = classList.match(/tgmp\-streamid\-(\w+)/i),
				theme = classList.indexOf('tgmp-theme') > -1 ? classList.match(/tgmp\-theme\-(\d+)/i)[1] : null,
				autostart = classList.indexOf('tgmp-autostart') > -1 ? true : false;

			log('Got switchstream link', this, streamid, theme, autostart);

			if (streamid.length < 2) {
				log('No stream ID provided, exiting.', streamid, streamid.length);
				return false;
			}

			streamid = streamid[1];
			e.preventDefault();
			window._CMLS.switchTGMPStream(streamid, autostart, theme);
		});
	});
}(jQuery, window.self));