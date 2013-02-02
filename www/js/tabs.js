/*
 * Табы
 */

(function($){
	$.fn.tabs = function( userSettings ){
		var SETTINGS = {
			linkSelector: '',
			tabSelector: '',
			selectedClass: 'selected',
			onSwitchTab: null
		};
		
		return this.each(function(){
			if( userSettings ){
				$.extend( SETTINGS, userSettings );
			}
			
			var tabsContainer = $(this),
				links = $(SETTINGS.linkSelector, tabsContainer),
				tabs = $(SETTINGS.tabSelector, tabsContainer);
			
			initTabs();
			assignEvents();
			
			function initTabs(){
				tabs.filter(':not(:first)').hide();
				links.eq(0).addClass(SETTINGS.selectedClass);
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
				var linkHrefTarget = link.attr('href').substr(1),
					targetTab = tabs.filter(function(){ return $(this).attr('id') == linkHrefTarget; });
				
				tabs.hide();
				targetTab.show();
				
				links.removeClass(SETTINGS.selectedClass);
				link.addClass(SETTINGS.selectedClass);
			}
		});
	};
})( jQuery );