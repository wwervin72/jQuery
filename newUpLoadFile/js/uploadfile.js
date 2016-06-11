(function ($, undefined) {
	$.fn.upLoadFile = function (setting) {
		var defaultSetting = {
			width : 700,
			height : 200,
			canDrag : true
		}
		$(this).each(function (i, item) {


			// if(defaultSetting.canDrag){
			// 	str = '<div class="selFile"><div class="iptBox"></div><div class="dragBox"><span>或者将文件拖到此处</span></div></div>';
			// }else{
				
			// }
			
			var _this = $(item);
			// _this.html(str);
			var selFile = $('.selFile', item),
			dragBox = $('.dragBox', item),
			iptBox = $('.iptBox', item),
			fileBtn = $('.fileBtn', item),
			fileInfo = $('.fileInfo', item),
			goDo = $('.goDo', item),
			fileInfoChild = $('.goDo').children();
			// _this.height(defaultSetting.height).width(defaultSetting.width).addClass('uploadfile');

			setLineHeight([dragBox, fileBtn, fileInfo, goDo])
			fileInfoChild.css('margin-top', -fileInfoChild.height() / 2 + 'px')
			function setLineHeight (objArr) {
				 objArr.forEach(function (item, i) {
				 	$(item).css({
				 		lineHeight : $(item).height() + 'px'
				 	})
				 })
			}
		})
	}
})(jQuery)