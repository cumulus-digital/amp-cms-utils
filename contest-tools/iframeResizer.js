(function($, window, undefined) {
	function resizeIframe() {
		// Wait for iFrameResize function to become available
		if ( ! $().iFrameResize) {
			setTimeout(resizeIframe, 100);
			return;
		}
		var iframe = $('.entry-content iframe');
		iframe.iFrameResize({
			log: false,
			checkOrigin: false,
			enablePublicMethods: true,
			heightCalculationMethod: 'taggedElement'
		});
	}
	$(function() {
		if ( ! $().iFrameResize) {
			$.getScript('https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.1.1/iframeResizer.min.js', resizeIframe);
			return;
		}
		resizeIframe();
	});
}(jQuery, window));