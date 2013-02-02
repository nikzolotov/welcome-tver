$(function(){
    $('.b-breadcrumbs .item').dropDownMenu();
    $('.flags').hide();

    var slide_width = 959;
    if($('.l-container').hasClass('l-container-960')) slide_width = 960;
    $('#slideshow').slideShow({
		slideFromKeyboard: true,
		dots: true,
		slideWidth: slide_width,
		slideDistance: 0
	});
	$('#indexSlideshow').slideShow({
		slideFromKeyboard: true,
		dots: true,
		haveDots: true,
		dotsContainerSelector: '.conts',
		dotSelector: '.b-cont',
		dotSample: '<a class="b-cont" href="?"><b></b></a>',
		dotSelectedClass: 'b-cont-selected',
		prevLinkSelector: '.b-icon-prev-big',
		nextLinkSelector: '.b-icon-next-big',
		slideWidth: '100ps',
		slideDistance: 0
	});

    var tiles_height = $('.b-tiles').height();
    if(tiles_height) $('.b-slideshow .slide').height(tiles_height-5);


	//$('.b-more').moreHistory();


	$(".b-contents .item .link").click(function(){
		var selected = $(this).attr('href');	
		$.scrollTo(selected, 500, {offset:-28 });		
		return false;
	});	

	
	$('.b-top-contents').scrollingСontents();

	var title_boxes = $('.b-mark-title-boxes .left-box, .b-mark-title-boxes .right-box');
	title_boxes.hide();
	setTimeout(function(){ 
		title_boxes.fadeIn(200);
	},500);



	var object_title = $('#tiles .b-object-title'),
		length_title = $('#tiles .b-object-title .arrow').text().length;

	editTitle(object_title, length_title);


	function editTitle(title, title_length){
		if(title_length >= 19 && title_length < 32){
			title.css('font-size', '54px').css('line-height','50px');
		}
		else if(title_length >= 32 && title_length <= 33){
			title.css('font-size', '34px').css('line-height','32px');
		}
		else if(title_length > 33){
			title.css('font-size', '40px').css('line-height','41px');
		}
	}

	var mark_title = $('.b-wrapper-slideshow .b-mark-title'),
		length_mark_title = $('.b-wrapper-slideshow .b-mark-title .text').text().length;

	editTitle2(mark_title, length_mark_title);
	function editTitle2(mark_title, length_mark_title){
		if(length_mark_title >= 25 && length_mark_title <= 33){
			mark_title.css('font-size', '44px').css('line-height','36px');
		}
		else if(length_mark_title > 33 && length_mark_title <= 51){
			mark_title.css('font-size', '24px').css('line-height','23px');
		}
		else if(length_mark_title > 51){
			mark_title.css('font-size', '24px').css('line-height','27px');
		}
		
	}

	$('#indexSlideshow').resizeIndex();

	//$('.b-contents .item').changeContents();

});





(function( $ ){
	/*$.fn.changeContents = function(userOptions) {
		var OPTIONS = {
             links: '.link'
        };
        return this.each(function(index,element){
        	if(userOptions) {
		        $.extend( OPTIONS, userOptions );
		    }
        	var container = $(this),
        		links_contents = $(OPTIONS.links, container),
        		link_anchor = links_contents.attr('href'),
        		object_anchor = $(link_anchor + '');

        	function selected
        	
        });
	};*/
	$.fn.resizeIndex = function(userOptions) {
		var OPTIONS = {
            title: '.b-mark-title-boxes',
			frame: '.frame-slideshow',
			slides: '.slide',
			conts: '.conts'
        };
        return this.each(function(){
        	if(userOptions) {
		        $.extend( OPTIONS, userOptions );
		    }
        	var contents = $(this),
        		title = $(OPTIONS.title, contents),
        		frame = $(OPTIONS.frame, contents),
        		slides = $(OPTIONS.slides, contents),
        		conts = $(OPTIONS.conts, contents),
        		height_window = $(window).height();

        	$(window).resize(function(){
        		height_window = $(window).height();
        		settingSize();
        	});
        	settingSize();
        	function settingSize(){
        		var distance = conts.offset().top + conts.height() - 64;
        		if(height_window < distance){
        			var value = distance/height_window;

        			title_margin = 120/value*1.4;
        			if(title_margin < 96) title_margin = 96;
        			title.css('marginBottom', title_margin+'px');

        			slide_padding = 136/value*0.5;
        			if(slide_padding < 50) slide_padding = 50;
        			slides.css('paddingTop', slide_padding+'px');

        			frame_margin = 120/value*0.4;
        			if(frame_margin < 20) frame_margin = 20;
        			frame.css('marginBottom', frame_margin+'px');
        		}
        	}
        	
        });
	};


	$.fn.scrollingСontents = function(userOptions) {
		var OPTIONS = {
            top: 20
        };
        return this.each(function(){
        	if(userOptions) {
		        $.extend( OPTIONS, userOptions );
		    }
        	var contents = $(this),
        		coordinates = contents.offset(),
        		scroll_top = Math.round(coordinates.top),
        		scrolled = $(window).scrollTop();
        		
        	scrilling();

        	function scrilling(){
	        	toggleFixed(scroll_top, scrolled);
	        	$(window).scroll(function(){
	        		scrolled = $(window).scrollTop()
	        		toggleFixed(scroll_top-28, scrolled);
	        	});
	        }

	        function toggleFixed(scroll_top, scrolled){
	        	if(scroll_top <= scrolled) contents.addClass('b-fixed-top-contents');
	        	else contents.removeClass('b-fixed-top-contents');
	        }
        });
	};

	$.fn.dropDownMenu = function(userOptions) {
		var OPTIONS = {
            speed: 150,
            hover_links: '.b-object-link .text',
            sub_menu: '.b-sub-menu'
        };

        return this.each(function(){
        	if(userOptions) {
		        $.extend( OPTIONS, userOptions );
		    }

		    var containers = $(this),
		    	hover_links = $(OPTIONS.hover_links, containers),
		    	hidden_menu = $(OPTIONS.sub_menu, containers);
		    hidden_menu.width(hover_links.width() - 14)
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

