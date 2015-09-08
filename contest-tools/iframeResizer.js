(function($, window, undefined) {
	function resizeIframe() {
		// Wait for iFrameResize function to become available
		if ( ! $().iFrameResize) {
			setTimeout(resizeIframe, 100);
			return;
		}
		var isOldIE = (navigator.userAgent.indexOf("MSIE") !== -1);
		window._CMLS = window._CMLS || {};
		window._CMLS.debug = window._CMLS.debug || false;
		var iframe = $('.entry-content iframe');
		iframe.iFrameResize({
			log: window._CMLS.debug,
			checkOrigin: false,
			enablePublicMethods: true,
			heightCalculationMethod: isOldIE ? 'max' : 'lowestElement'
		});
	}
	$(function() {
		if ( ! $().iFrameResize) {
			$.getScript('https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.2.0/iframeResizer.min.js', resizeIframe);
			return;
		}
		resizeIframe();
	});
}(jQuery, window));