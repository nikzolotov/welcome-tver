/*
* Input hints
*/

(function($){
	$.fn.hints = function( options ){
		var CONFIG = {
			hintClass: 'b-hint-state'
		};

		return this.each(function(){
			if( options ){
				$.extend( CONFIG, options );
			}

			var label = $(this),
				defaultValue = label.text(),
				input = $('input[id=' + label.attr('for') + ']');

			initLabels();
			assignEvents();

			function initLabels(){
				label.hide();
			}

			function assignEvents(){
				input.focus(function(){
					var input = $(this),
						value = input.val();

					if( value == defaultValue ){
						input.val('').removeClass(CONFIG.hintClass);
					}
				});

				input.blur(function(){
					var input = $(this),
						value = input.val();

					if( $.trim(value) === '' || $.trim(value) == defaultValue ){
						input.val(defaultValue).addClass(CONFIG.hintClass);
					}
				}).blur();
			}
		});
	};
})( jQuery );