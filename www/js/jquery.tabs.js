/*
 * Табы
 */

(function($){
	$.fn.tabs = function( userSettings ){
		var SETTINGS = {
			linkSelector: '',
			tabSelector: '',
			selectedClass: 'selected',
			animation: {
				type: '',
				time: 0
			},
			onSwitchTab: null
		};
		
		return this.each(function(){
			if( userSettings ){
				$.extend( SETTINGS, userSettings );
			}
			
			var tabsContainer = $(this),
				links = $(SETTINGS.linkSelector, tabsContainer),
				tabs = $(SETTINGS.tabSelector, tabsContainer),
				openedTab;
			
			initTabs();
			assignEvents();
			
			function initTabs(){
				var selectedLink = links.filter('.selected').first();
				
				if( selectedLink.length ){
					openedTab = tabByLink( selectedLink );
					switchTab( selectedLink );
				}
				else{
					openedTab = tabByLink( links.first() );
					switchTab( links.first() );
				}
			}
			
			function assignEvents(){
				links.click(
					clickHandler
				);
				
				// Shit hack. Нужен для того, чтобы просто переключить таб, без вызова callback-функции
				links.bind(
					'clickOnly',
					clickOnlyHandler
				);
			}
			
			function clickHandler( event ){
				event.preventDefault();
				
				switchTab( $(this) );
				
				if( $.isFunction(SETTINGS.onSwitchTab) ) 
					SETTINGS.onSwitchTab.call(this, event);
			}
			
			function clickOnlyHandler( event ){
				event.preventDefault();
				
				switchTab( $(this) );
			}
			
			function switchTab( link ) {
				var targetTab = tabByLink( link );
				
				if( SETTINGS.animation.type == 'tabSize' ){
					var targetTabWidth = targetTab.width(),
						targetTabHeight = targetTab.height();
					
					tabs.hide();
					
					targetTab.width( openedTab.width() );
					targetTab.height( openedTab.height() );
					
					targetTab.show().animate({
						width: targetTabWidth,
						height: targetTabHeight
					}, SETTINGS.animation.time);
				}
				else{
					tabs.hide();
					targetTab.show();
				}
				
				openedTab = targetTab;
				
				links.removeClass(SETTINGS.selectedClass);
				link.addClass(SETTINGS.selectedClass);
			}
			
			function tabByLink( link ){
				return tabs.filter(function(){
					return $(this).attr('id') == link.attr('href').substr(1);
				});
			}
		});
	};
})( jQuery );