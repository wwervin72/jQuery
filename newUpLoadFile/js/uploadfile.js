(function ($, undefined) {
	$.fn.upLoadFile = function (setting) {
		var defaultSetting = {
			width : 250,
			height : 150,
			canDrag : false,
			canSelmultiple : true
		};
		defaultSetting = $.extend(true, {}, defaultSetting, setting);

		//宽高最小值为220和200
		defaultSetting.width < 220 && (defaultSetting.width = 220);
		defaultSetting.height < 200 && (defaultSetting.height = 200);
		$(this).each(function (i, item) {

			//构造DOM节点
			var htmlStr =           '<div class="selFile">'; 
				htmlStr +=				'<div class="iptBox">'; 
				htmlStr +=					'<img src="img/add_img.png" class="addImg">'; 
				htmlStr +=					'<div class="file">'; 
				htmlStr +=						'<input type="file" class="fileIpt" multiple/>'; 
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
			iptBox = $('.iptBox', selFile),
			addImg = $('.addImg', iptBox),
			dragBox = $('.dragBox', selFile),
			fileIpt = $('.fileIpt', iptBox),
			fileBtn = $('.fileBtn', iptBox),
			fileInfo = $('.fileInfo', item),
			info = $('.info', fileInfo),
			goDo = $('.goDo', fileInfo),
			fileImg = $('.fileDetailInfo img', item),
			fileInfoChild = $('.goDo', item).children();

			//取消多选
			defaultSetting.canSelmultiple || fileIpt.removeAttr('multiple');

			//修改样式
			_this.outerWidth(defaultSetting.width).outerHeight(defaultSetting.height);

			//没有拖拽功能
			defaultSetting.canDrag || (dragBox.hide() &&  iptBox.css({width : '100%'}) && addImg.addClass('smAddImg'));

			//当宽度小于400的时候，fileinfo部分分为两行
			if(defaultSetting.width < 400){
				selFile.addClass('smSelFile');
				fileInfo.addClass('smFileInfo');
				info.addClass('smInfo');
				goDo.addClass('smGoDo');
				setLineHeight([info, goDo])
			}

			addImg.height(addImg.width() * 65 /75);

			//居中样式
			setLineHeight([dragBox, fileBtn, fileInfo, goDo]);

			//上传文件展示
			fileImg.each(function (i, item) {
				i !==0 && i % 4 ===0 && $(item).css('margin-right', 0);
			})

			//上传按钮居中
			fileInfoChild.css('margin-top', -fileInfoChild.height() / 2 + 'px')

			//给input标签绑定onchange事件
			fileIpt.on('change', getFiles);

			function setLineHeight (objArr) {
				 objArr.forEach(function (item, i) {
				 	$(item).css({
				 		lineHeight : $(item).height() + 'px'
				 	})
				 })
			}
			function getFiles (e) {
				var e = e || window.event;
				var files = e.target.files;
				$(files).each(function (i, item) {

				})
			}
		})
	}
})(jQuery)