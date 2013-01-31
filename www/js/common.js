$(function(){
	// Background
	var illustrations = $('#illustrations'),
		illustration = illustrations.children(),
		illustrationsCount = 9,
		illustrationWidth = 1940,
		illustrationHeight = 1617,
		windowWidth = $(window).width(),
		windowHeight = $(window).height(),
		windowScrollTop = $(window).scrollTop(),
		windowScrollLeft = $(window).scrollLeft(),
		
		moveSign = '-',
		moveInterval;
	
	for( var i = 0; i < illustrationsCount - 1; i++ ){
		illustration.clone().appendTo(illustrations);
	}
	
	illustrations.css('left', Math.round(illustrationWidth * illustrationsCount / 2) * -1 - 900);
	
	illustrations.draggable({
		containment: [windowWidth - (illustrationWidth * illustrationsCount), windowHeight + windowScrollTop - illustrationHeight, 0, windowScrollTop],
		scroll: false,
		start: stopMoving,
		stop: startMoving
	});
	
	$(window).scroll(function(){
		windowScrollTop = $(this).scrollTop();
		windowScrollLeft = $(this).scrollLeft();
		
		illustrations.draggable('option', 'containment',
			[windowWidth - (illustrationWidth * illustrationsCount), windowHeight + windowScrollTop - illustrationHeight, 0, windowScrollTop]
		);
	});
	
	$(window).resize(function(){
		windowWidth = $(this).width();
		windowHeight = $(this).height();
		windowScrollTop = $(this).scrollTop();
		windowScrollLeft = $(this).scrollLeft();
		
		illustrations.draggable('option', 'containment',
			[windowWidth - (illustrationWidth * illustrationsCount), windowHeight + windowScrollTop - illustrationHeight, 0, windowScrollTop]
		);
	});
	
	function moveIllustration(){
		if( moveSign == '-' ){
			if( illustrations.offset().left == (windowWidth - (illustrationWidth * illustrationsCount)) ){
				moveSign = '+';
			}
			illustrations.css('left', illustrations.offset().left - windowScrollLeft - 1);
		}
		else{
			if( illustrations.offset().left == 0 ){
				moveSign = '-';
			}
			illustrations.css('left', illustrations.offset().left - windowScrollLeft + 1);
		}
	}
	
	function startMoving(){
		moveInterval = setInterval(moveIllustration, 100);
	}
	
	function stopMoving(){
		clearInterval(moveInterval);
	}
	
	startMoving();
	
	// Прозрачность тени логотипа
	if(!($.browser.msie && $.browser.version == '6.0')){
		var theWindow = $(window),
			logoShadow = $('.logo .shadow'),
			startPosition = 260,
			windowScrolled = 0;
		
		theWindow.scroll(function(){
			windowScrolled = theWindow.scrollTop();
			
			if( windowScrolled > (startPosition - 100) ){
				logoShadow.css('opacity', (startPosition - windowScrolled) / 100);
			}
			else{
				logoShadow.css('opacity', 1);
			}
		}).scroll();
	}
});