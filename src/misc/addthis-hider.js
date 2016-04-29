;(function($, window, undefined) {

	/**
	 * Allow hiding of AddThis widgets
	 */
	$(function(){
		if (window.NO_ADDTHIS_HERE) {
			$('.addthis-smartlayers').hide();
		}
	});

	/**
	 * Remove AddThis on page transition
	 */
	if (window.self !== window.top) {
		if (window.top.destroyAddThis){
			window.top.destroyAddThis();
		}
	} else {
		window.top.destroyAddThis = function() {
			$(window.top.document.querySelectorAll('.addthis-smartlayers')).hide();
		};
	}

}(jQuery, window));
