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
			balloon: 'slide-balloon',
			elementsOnIllustration: '.flags',
			elementBalloon: '.b-ball',
			signSlide: '.sign',
			textSignSlide: '.b-gallery-image .sign .text',
			slideBy: 1,
			slidePerPage: 1,
			slideWidth: 550,
			slideDistance: 38,
			animationTime: 300,
			slideFromKeyboard: false,
			dots: false,
			haveDots: false
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
				firstSlideGallery = $(SETTINGS.firstSlideGallery, container),
				elementsOnIllustration = $(SETTINGS.elementsOnIllustration),
				elementBalloon = $(SETTINGS.elementBalloon),
				textSignSlide = $(SETTINGS.textSignSlide, container),
				slidesCount = slides.length,
				slidesWidht = SETTINGS.slideWidth,
				currentPage = 0;
				
			

			if( SETTINGS.dots && slidesCount > 1 ){
				var dots,
					dotsContainer = $(SETTINGS.dotsContainerSelector, container);
				if(!SETTINGS.haveDots) prepareDots();
				else dots = $(SETTINGS.dotSelector, dotsContainer);
			}
			sizeSlide();
			$(window).resize(function(){
				if(SETTINGS.slideWidth == '100ps'){
					if($(window).width() > 1155){
						slidesWidht = $(window).width();
						container.add(slides).width(slidesWidht);
						slidesContainer.css('marginLeft', (currentPage * (slidesWidht + SETTINGS.slideDistance) * SETTINGS.slideBy * -1));
					}
				}
			});
			hiddenSign();
			manageLinks();
			assignEvents();
			sizeFrame();

			function sizeSlide(){
				if(slidesWidht == '100ps'){
					if($(window).width() > 1155){
						slidesWidht = $(window).width();
					}
					else {
						slidesWidht = 1155;
					}
					container.add(slides).width(slidesWidht);
				}
				else container.add(slides).width(slidesWidht);
			}

			function hiddenSign(){
				textSignSlide.each(function(index, element){
					if($(element).text() == ''){
						$(element).parents(SETTINGS.signSlide).hide();
					}
				});
				
			}


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
				slideBallon();
				
				var shift = shiftFrame();
				if(shift == 7) frameContainer.width(slidesWidht).css('marginLeft','0');

				slidesContainer.animate({
					marginLeft: (currentPage * (slidesWidht + SETTINGS.slideDistance) * SETTINGS.slideBy * -1)
				}, SETTINGS.animationTime, function(){
					var marginLeft = parseInt($(this).css('marginLeft'));
					if(shift == 0) frameContainer.width(slidesWidht+7).css('marginLeft','-7px');
					if(shift == -1) shift = 0;
					
					$(this).css('marginLeft', marginLeft-shift);
				});
				
				manageLinks();
			}

			function slideBallon(){
				if(slides.eq(currentPage).hasClass(SETTINGS.balloon)) {
					elementsOnIllustration.fadeIn(100);
					elementBalloon.fadeIn(200);
				}
				else {
					elementsOnIllustration.hide(100);
					elementBalloon.hide(100);
				}
			}
		});
	};
})( jQuery );













