(function($, window, undefined) {
	function resizeIframe() {
		// Wait for iFrameResize function to become available
		if ( ! $().iFrameResize) {
			setTimeout(resizeIframe, 100);
			return;
		}
		var iframe = $('.entry-content iframe');
		iframe.iFrameResize({
			log: true,
			checkOrigin: false,
			heightCalculationMethod: 'max'
		});
	}
	$(function() {
		if ( ! $().iFrameResize) {
			$.getScript('https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/2.8.6/iframeResizer.min.js', resizeIframe);
			return;
		}
		resizeIframe();
	});
}(jQuery, window));