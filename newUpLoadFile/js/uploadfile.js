(function ($, undefined) {
	$.fn.upLoadFile = function (setting) {
		var defaultSetting = {
			width : 350,
			height : 200,
			canDrag : true
		};
		defaultSetting = $.extend(true, {}, defaultSetting, setting);
		$(this).each(function (i, item) {

			//构造DOM节点
			var htmlStr =           '<div class="selFile">'; 
				htmlStr +=				'<div class="iptBox">'; 
				htmlStr +=					'<img src="img/add_img.png" class="addImg">'; 
				htmlStr +=					'<div class="file">'; 
				htmlStr +=						'<input type="file" class="fileIpt"/>'; 
				htmlStr +=						'<div class="fileBtn">点击选择文件</div>'; 
				htmlStr +=					'</div>';
				htmlStr +=				'</div>'; 
				htmlStr +=				'<div class="dragBox">'; 
				htmlStr +=					'或者将文件拖到此处';
				htmlStr +=				'</div>'; 
				htmlStr +=			'</div>'; 
				htmlStr +=			'<div class="fileInfo">'; 
				htmlStr +=				'<div class="info">'; 
				htmlStr +=					'选择了<span class="fileCount">1</span>个文件，共有';
				htmlStr +=					'<span class="fileSize">860.65</span>KB。</div>';
				htmlStr +=				'<div class="goDo">';
				htmlStr +=					'<input type="file" class="continueSelIpt"/>';
				htmlStr +=					'<button class="continueSelBtn">继续选择</button>';
				htmlStr +=					'<button class="beginUpload">开始上传</button>';
				htmlStr +=				'</div>';
				htmlStr +=			'</div>'; 
				htmlStr +=			'<div class="fileDetailInfo">';
				htmlStr +=			'</div>';

			//获取DOM元素
			var _this = $(item);
			_this.html(htmlStr);
			var selFile = $('.selFile', item),
			dragBox = $('.dragBox', item),
			iptBox = $('.iptBox', item),
			fileBtn = $('.fileBtn', item),
			fileInfo = $('.fileInfo', item),
			info = $('.info', item),
			goDo = $('.goDo', item),
			fileImg = $('.fileDetailInfo img', item),
			fileInfoChild = $('.goDo', item).children();

			//修改样式
			_this.width(defaultSetting.width).height(defaultSetting.height);
			//没有拖拽功能
			defaultSetting.canDrag || (dragBox.hide() &&  iptBox.css({width : '100%'}));
			if(defaultSetting.width < 400){
				info.css({width : '100%'})
				var godo = goDo.remove();
				godo.css({top : '100%'})
				fileInfo.append(godo);
			}
			//居中样式
			setLineHeight([dragBox, fileBtn, fileInfo, goDo]);
			//上传文件展示
			fileImg.each(function (i, item) {
				i !==0 && i % 4 ===0 && $(item).css('margin-right', 0);
			})
			//上传按钮居中
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