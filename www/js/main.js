$(function(){
    $('.b-breadcrumbs').dropDownMenu();
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
	    		.slideDown(OPTIONS.speed);
	    	},function(){
	    		$(this)
	    		.find(OPTIONS.sub_menu)
	    		.slideUp(OPTIONS.speed);
	    	})
	    }

	    return toggleMenu()

	};

})( jQuery );