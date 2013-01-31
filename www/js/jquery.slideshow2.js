(function($){
	$.fn.slideShow2 = function( userSettings ){
		var SETTINGS = {
			slidesContainerSelector: '.slides',
			slideSelector: '.slide',
			prevLinkSelector: '.b-icon2-prev',
			nextLinkSelector: '.b-icon2-next',
			prevLinkDisabledClass: 'hidden',
			nextLinkDisabledClass: 'hidden',
			dotsContainerSelector: '.dots',
			dotSelector: '.b-dot',
			dotSample: '<a class="b-dot" href="?"><b></b></a>',
			dotSelectedClass: 'b-dot-selected',
			slideBy: 1,
			slidePerPage: 1,
			slideWidth: 550,
			slideDistance: 38,
			animationTime: 300,
			slideFromKeyboard: false,
			dots: false
		};
		
		return this.each(function(){
			if( userSettings ){
				$.extend( SETTINGS, userSettings );
			}
			
			var container = $(this),
				slidesContainer = $(SETTINGS.slidesContainerSelector, container),
				slides = $(SETTINGS.slideSelector, container),
				prevLink = $(SETTINGS.prevLinkSelector, container),
				nextLink = $(SETTINGS.nextLinkSelector, container),
				slidesCount = slides.length,
				currentPage = 0;
			
			if( SETTINGS.dots && slidesCount > 1 ){
				var dots,
					dotsContainer = $(SETTINGS.dotsContainerSelector, container);
				
				prepareDots();
			}
			
			manageLinks();
			assignEvents();
			
			function prepareDots(){
				var dotsHtml = '';
				
				for( var i = 0; i < slidesCount; i++ ){
					dotsHtml += SETTINGS.dotSample;
				}
				
				dotsContainer.html(dotsHtml);
				dots = $(SETTINGS.dotSelector, dotsContainer);
			}
			
			function manageLinks(){
				if( currentPage == 0 ){
					prevLink.addClass(SETTINGS.prevLinkDisabledClass);
				}
				else if( prevLink.hasClass(SETTINGS.prevLinkDisabledClass) ){
					prevLink.removeClass(SETTINGS.prevLinkDisabledClass);
				}
				if( slidesCount < SETTINGS.slidePerPage || currentPage == (Math.ceil((slidesCount - SETTINGS.slidePerPage + SETTINGS.slideBy) / SETTINGS.slideBy) - 1) ){
					nextLink.addClass(SETTINGS.nextLinkDisabledClass);
				}
				else if( nextLink.hasClass(SETTINGS.nextLinkDisabledClass) ){
					nextLink.removeClass(SETTINGS.nextLinkDisabledClass);
				}
				
				if( SETTINGS.dots && slidesCount > 1 ){
					dots.removeClass(SETTINGS.dotSelectedClass);
					dots.eq(currentPage).addClass(SETTINGS.dotSelectedClass);
				}
			}
			
			function assignEvents(){
				prevLink.click(function(event){
					if( currentPage > 0 ){
						currentPage--;
						switchSlide();
					}
					
					event.preventDefault();
				});
				
				nextLink.click(function(event){
					if( currentPage < (Math.ceil((slidesCount - SETTINGS.slidePerPage + SETTINGS.slideBy) / SETTINGS.slideBy) - 1) ){
						currentPage++;
						switchSlide();
					}
					
					event.preventDefault();
				});
				
				if( SETTINGS.slideFromKeyboard ){
					$(document).keyup(function(event){
						var keycode = (event == null) ? event.keyCode : event.which;
						
						if( keycode == 37 ){
							prevLink.click();
						}
						if( keycode == 39 ){
							nextLink.click();
						}
					});
				}
				
				if( SETTINGS.dots && slidesCount > 1 ){
					dots.click(function(event){
						var thisIndex = $(this).index();
						
						if( thisIndex != currentPage ){
							currentPage = thisIndex;
							switchSlide();
						}
						
						event.preventDefault();
					});
				}
			}
			
			function switchSlide(){
				slidesContainer.animate({
					marginLeft: currentPage * (SETTINGS.slideWidth + SETTINGS.slideDistance) * SETTINGS.slideBy * -1
				}, SETTINGS.animationTime);
				
				manageLinks();
			}
		});
	};
})( jQuery );