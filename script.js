(function($){
	var methods = {
		init : function(options) {
			return this.each(function(){
				var row = $(this).attr('row');
				var col = $(this).attr('col');
				//create table
				var t = '<table class="blockTable">';
				for(var i=0; i<row; i++){
					t += '<tr class="blockTR">';
					for(var j=0; j<col; j++){
						t += '<td id="'+i+'_'+j+'"></td>';
					}
					t += '</tr>';
				}
				t += '</table>';
				$(this).find('div.block:first').before(t);
				$(this).find('div.block').board('move');
			});
		},
		
		resize : function(options){
			return this.each(function(){
				$(this).css({
					width : $(this).parent().width() * options.width,
					height : $(this).parent().height() * options.height
				});
				$(this).find('div.block').board('move');
			});
		},
		
		move : function(options){
			return this.each(function(){
				if($(this).hasClass('block')){
					var settings = {
						row : parseInt($(this).attr('row')),
						col : parseInt($(this).attr('col')),
						rowspan : parseInt($(this).attr('rowspan')),
						colspan : parseInt($(this).attr('colspan')),
						isAnim : false
					};
					if(options){
						$.extend(settings, options);
					}
					
					var row = $(this).parent().attr('row');
					var col = $(this).parent().attr('col');
					var x = Math.round($(this).parent().width() / col);
					var y = Math.round($(this).parent().height() / row);
					
					if(settings.row + settings.rowspan > row){
						settings.rowspan = row - settings.row;
					}
					if(settings.col + settings.colspan > col){
						settings.colspan = col - settings.col;
					}
					
					$(this).attr('row', settings.row);
					$(this).attr('col', settings.col);
					$(this).attr('rowspan', settings.rowspan);
					$(this).attr('colspan', settings.colspan);
					
					var tdpos = new Object();
					if(settings.row >= 0 && settings.row < row){
						tdpos.top = $(this).parent().find('#'+settings.row+'_0').position().top;
					}else if(settings.row < 0){
						tdpos.top = 0;
					}else{
						var tableCell = $(this).parent().find('#'+(row-1)+'_0');
						tdpos.top = tableCell.position().top + tableCell.height();
					}
					if(settings.col >= 0 && settings.col < col){
						tdpos.left = $(this).parent().find('#0_'+settings.col).position().left;
					}else if(settings.col < 0){
						tdpos.left = 0;
					}else{
						var tableCell = $(this).parent().find('#0_'+(col-1));
						tdpos.left = tableCell.position().left + tableCell.width();
					}

					var width = 0;
					var height = 0;
					if(settings.colspan == 0){
						width = 0;
					}else if(settings.col+settings.colspan < col){
						var lasttdpos = $(this).parent().find('#'+settings.row+'_'+(settings.col+settings.colspan)).position();
						width = lasttdpos.left - tdpos.left - 1;
					}else{
						width = $(this).parent().width() - tdpos.left - 2;
					}
					
					if(settings.rowspan == 0){
						height = 0;
					}else if(settings.row+settings.rowspan < row){
						var lasttdpos = $(this).parent().find('#'+(settings.row+settings.rowspan)+'_'+settings.col).position();
						height = lasttdpos.top - tdpos.top - 1;
					}else{
						height = $(this).parent().height() - tdpos.top - 2;
					}
					
					if(settings.rowspan > 0 && settings.colspan > 0){
						$(this).show();
					}
					if(settings.isAnim){
						$(this).animate({
							top : tdpos.top,
							left : tdpos.left,
							width : width,
							height : height
						},function(){
							if(settings.rowspan==0 || settings.colspan==0){
								$(this).hide();
							}
						});
					}else{
						$(this).css({
							top : tdpos.top,
							left : tdpos.left,
							width : width,
							height : height
						},function(){
							if(settings.rowspan==0 || settings.colspan==0){
								$(this).hide();
							}
						});
					}
				}
			});
		}
	};

	$.fn.board = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    
	};
})(jQuery);