(function($){
	$.fn.slideShow = function( userSettings ){
		var SETTINGS = {
			slidesContainerSelector: '.slides',
			frameContainer: '.frame',
			slideSelector: '.slide',
			prevLinkSelector: '.b-icon-prev',
			nextLinkSelector: '.b-icon-next',
			prevLinkDisabledClass: 'hidden',
			nextLinkDisabledClass: 'hidden',
			linkOnGallery: '.b-link-on-gallery',
			dotsContainerSelector: '.dots',
			dotSelector: '.b-dot',
			dotSample: '<a class="b-dot" href="?"><b></b></a>',
			dotSelectedClass: 'b-dot-selected',
			slideShowObject: 'b-slideshow-objects',
			firstSlideGallery: '.b-gallery-image:first',
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
				frameContainer = $(SETTINGS.frameContainer, container),
				linkOnGallery = $(SETTINGS.linkOnGallery),
				firstSlideGallery = $(SETTINGS.firstSlideGallery, container)
				slidesCount = slides.length,
				currentPage = 0;
				
			container.add(slides).width(SETTINGS.slideWidth);

			if( SETTINGS.dots && slidesCount > 1 ){
				var dots,
					dotsContainer = $(SETTINGS.dotsContainerSelector, container);
				
				prepareDots();
			}
			
			manageLinks();
			assignEvents();
			sizeFrame();


			function shiftFrame() {
				if(container.hasClass(SETTINGS.slideShowObject)){

					if(currentPage == 0) return 0;
					else return 7;
				}
				else return -1;
			}

			function sizeFrame() {
				if(container.hasClass(SETTINGS.slideShowObject)){
					if(currentPage == 0) frameContainer.width(SETTINGS.slideWidth+7).css('margin-left','-7px');
					else frameContainer.width(SETTINGS.slideWidth).css('margin-left','0');
				}
			}
			
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
						changeSlide(thisIndex)
						
						event.preventDefault();
					});
					linkOnGallery.click(function(event){
						changeSlide(firstSlideGallery.index(SETTINGS.slideSelector, container))
						
						event.preventDefault();
					});
				}
			}

			function changeSlide(index){
				if( index != currentPage ){
					currentPage = index;
					switchSlide();
				}
			}
			
			function switchSlide(){
				var shift = shiftFrame();
				if(shift == 7) frameContainer.width(SETTINGS.slideWidth).css('marginLeft','0');

				slidesContainer.animate({
					marginLeft: (currentPage * (SETTINGS.slideWidth + SETTINGS.slideDistance) * SETTINGS.slideBy * -1)
				}, SETTINGS.animationTime, function(){
					var marginLeft = parseInt($(this).css('marginLeft'));
					if(shift == 0) frameContainer.width(SETTINGS.slideWidth+7).css('marginLeft','-7px');
					if(shift == -1) shift = 0;
					
					$(this).css('marginLeft', marginLeft-shift);
				});
				
				manageLinks();
			}
		});
	};
})( jQuery );