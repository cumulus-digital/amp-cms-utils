/**
 * Allow hiding of AddThis widgets
 */
;(function($, window, undefined) {

	$(function(){
		if (window.NO_ADDTHIS_HERE) {
			$('.addthis-smartlayers').hide();
		}
	});

}(jQuery, window));