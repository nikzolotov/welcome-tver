$(function(){
    $('.b-breadcrumbs').dropDownMenu();
    $('#slideshow').slideShow({
		slideFromKeyboard: true,
		dots: true,
		slideWidth: 959,
		slideDistance: 0
	}); 
});





(function( $ ){

	$.fn.dropDownMenu = function(userOptions) {
		var OPTIONS = {
            speed: 150,
            items: '.b-breadcrumbs .item',
            hover_links: '.b-object-link',
            sub_menu: '.b-sub-menu'
        };


	    if(userOptions) {
	        $.extend( OPTIONS, userOptions );
	    }

	    function toggleMenu(){
	    	$(OPTIONS.items).hover(function(){
	    		$(this)
	    		.find(OPTIONS.sub_menu)
	    		.stop(true, true)
	    		.slideDown(OPTIONS.speed);
	    	},function(){
	    		$(this)
	    		.find(OPTIONS.sub_menu)
	    		.stop(true, true)
	    		.slideUp(OPTIONS.speed);
	    	})
	    }

	    return toggleMenu()

	};

})( jQuery );