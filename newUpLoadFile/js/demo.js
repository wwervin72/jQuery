;(function ($, undefined) {
	$.fn.uploadfile = function (setting) {
		var defaultSetting = {
			width : 600,
			height : 300,
			canDrag : true,
			canMultiple : true
		};
		setting = $.extend(true, {}, defaultSetting, setting);

		$(this).each(function (i, item) {
			$(item).css({
				width : setting.width,
				height : setting.height
			});
			//是否可以拖拽图片上传
			if(setting.canDrag){
				var demoHtml =  			'<div class="file_sel">'
				 demoHtml +=					'<div class="file_input">'
				 demoHtml +=						'<div class="sel_file_img">'
				 demoHtml +=							'<span><img src="img/add_img.png"/></span>'
				 demoHtml +=						'</div>'
				 demoHtml +=						'<div class="sel_file_btn">'
				 demoHtml +=							'<input type="file"/>'
				 demoHtml +=							'<button>点击选择文件</button>'
				 demoHtml +=						'</div>'
				 demoHtml +=					'</div>'
				 demoHtml +=					'<div class="file_drag">'
				 demoHtml +=						'<span>或者将文件拖到此处</span>'
				 demoHtml +=					'</div>'
				 demoHtml +=				'</div>'
				 demoHtml +=				'<div class="file_info_handle">'
				 demoHtml +=					'<div class="file_info">'
				 demoHtml +=						'当前选择了<span class="file_count">0</span>个文件，共<span class="file_size">0</span>KB。'
				 demoHtml +=						'<input type="file"/>'
				 demoHtml +=						'<button class="continue_sel">继续选择</button>'
				 demoHtml +=						'<button class="uploadfile">开始上传</button>'
				 demoHtml +=					'</div>'
				 demoHtml +=				'</div>'
				 demoHtml +=				'<div class="file_show">'
				 demoHtml +=					'<span class="img_box">'
				 demoHtml +=						'<span class="img_handle"></span>'
				 demoHtml +=						'<img src="img/file.png" alt="">'
				 demoHtml +=					'</span>'
				 demoHtml +=				'</div>'
			}else{

			}
		})
	}
})(jQuery)