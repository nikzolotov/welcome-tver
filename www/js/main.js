$(function(){
    $('.b-breadcrumbs .item').dropDownMenu();
    $('#slideshow').slideShow({
		slideFromKeyboard: true,
		dots: true,
		slideWidth: 959,
		slideDistance: 0
	});
	$('.b-more').moreHistory();
});





(function( $ ){

	$.fn.moreHistory = function(userOptions) {
		var OPTIONS = {
			height: 154,
            toggle: '.frame',
            link_activation: '.link'
        };


	    return this.each(function(){
	    	if(userOptions) {
		        $.extend( OPTIONS, userOptions );
		    }
		    var container = $(this),
		    	link = $(OPTIONS.link_activation, container),
		    	frame = $(OPTIONS.toggle, container);

		    toggleFrame();

		    function toggleFrame(){
		    	link.toggle(function(event){
		    		height_auto = frame.removeAttr('style').height();
		    		frame.attr('style','height: 154px').stop().animate({
		    			height: height_auto
		    		},150);

		    		event.preventDefault();
		    	},function(event){
		    		frame.animate({
		    			height: OPTIONS.height + 'px'
		    		},150);

		    		event.preventDefault();
		    	});
	    	}

	    });
	};

	$.fn.dropDownMenu = function(userOptions) {
		var OPTIONS = {
            speed: 150,
            hover_links: '.b-object-link',
            sub_menu: '.b-sub-menu'
        };

        return this.each(function(){
        	if(userOptions) {
		        $.extend( OPTIONS, userOptions );
		    }

		    var containers = $(this),
		    	hidden_menu = $(OPTIONS.sub_menu, containers);

		    toggleMenu();
		    
		    function toggleMenu(){
		    	containers.hover(function(){
		    		hidden_menu.stop(true, true).slideDown(OPTIONS.speed);
		    	},function(){
		    		hidden_menu.stop(true, true).slideUp(OPTIONS.speed);
		    	});
		    }
        });

	};


})( jQuery );