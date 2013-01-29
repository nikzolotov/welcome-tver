$(function(){
    $('.b-breadcrumbs .item').dropDownMenu();

    var slide_width = 959;
    if($('.l-container').hasClass('l-container-960')) slide_width = 960;
    $('#slideshow').slideShow({
		slideFromKeyboard: true,
		dots: true,
		slideWidth: slide_width,
		slideDistance: 0
	});

    var tiles_height = $('.b-tiles').height();
    if(tiles_height) $('.b-slideshow .slide').height(tiles_height-5);


	$('.b-more').moreHistory();


	$(".b-contents .item .link").click(function(){
		var selected = $(this).attr('href');	
		$.scrollTo(selected, 500, {offset:-20 });		
		return false;
	});	

	
	$('.b-top-contents').scrollingСontents();


});





(function( $ ){

	$.fn.scrollingСontents = function(userOptions) {
		var OPTIONS = {
            top: 20
        };
        return this.each(function(){
        	var contents = $(this),
        		coordinates = contents.offset(),
        		scroll_top = Math.round(coordinates.top),
        		scrolled = $(window).scrollTop();
        		
        	scrilling();

        	function scrilling(){
	        	toggleFixed(scroll_top, scrolled);
	        	$(window).scroll(function(){
	        		scrolled = $(window).scrollTop()
	        		toggleFixed(scroll_top-23, scrolled);
	        	});
	        }

	        function toggleFixed(scroll_top, scrolled){
	        	if(scroll_top <= scrolled) contents.addClass('b-fixed-top-contents');
	        	else contents.removeClass('b-fixed-top-contents');
	        }
        });
	};

	$.fn.moreHistory = function(userOptions) {
		var OPTIONS = {
			min_height: 154,
            toggle: '.frame',
            fader: '.fader',
            link_activation: '.link'
        };


	    return this.each(function(){
	    	if(userOptions) {
		        $.extend( OPTIONS, userOptions );
		    }
		    var container = $(this),
		    	link = $(OPTIONS.link_activation, container),
		    	frame = $(OPTIONS.toggle, container),
		    	fader = $(OPTIONS.fader, container);

		    toggleFrame();

		    function toggleFrame(){
		    	link.toggle(function(event){
		    		height_auto = frame.removeAttr('style').height() - 10;
		    		frame.attr('style','height: 154px').stop().animate({
		    			height: height_auto
		    		},150, function(){
		    			toggleShow('hidden')
		    		});

		    		event.preventDefault();
		    	},function(event){
		    		frame.animate({
		    			height: OPTIONS.min_height + 'px'
		    		},150);

		    		toggleShow('show');

		    		event.preventDefault();
		    	});
	    	}

	    	function toggleShow(parametr){
	    		if(parametr == 'hidden') {
	    			fader.hide();
	    			link.text('Скрыть')
	    		}
	    		else {
					fader.show();
					link.text('Продолжение истории')
	    		}
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

