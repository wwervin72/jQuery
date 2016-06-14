;(function ($, undefined) {
	$.fn.uploadfile = function (setting) {
		var defaultSetting = {
			url : '',
			width : 600,
			height : 50,
			canDrag : true,
			canMultiple : true
		};

		setting = $.extend(true, {}, defaultSetting, setting);
		setting.width < 450 && (setting.width = 450);

		$(this).each(function (i, item) {
			var demoHtml = '';
			//是否可以拖拽图片上传，构造dom结构
			if(setting.canDrag){
				setting.height < 200 && (setting.height = 200);
				demoHtml +=  			'<div class="file_sel">';
				demoHtml +=					'<div class="file_input">';
				demoHtml +=						'<div class="sel_file_img">';
				demoHtml +=							'<span><img src="img/add_img.png"/></span>';
				demoHtml +=						'</div>';
				demoHtml +=						'<div class="sel_file_btn">';
				demoHtml +=							'<input type="file"/>';
				demoHtml +=							'<button>点击选择文件</button>';
				demoHtml +=						'</div>';
				demoHtml +=					'</div>';
				demoHtml +=					'<div class="file_drag">';
				demoHtml +=						'<span>或者将文件拖到此处</span>';
				demoHtml +=					'</div>';
				demoHtml +=				'</div>';
				demoHtml +=				'<div class="file_info_handle">';
				demoHtml +=					'<div class="file_info">';
				demoHtml +=						'当前选择了<span class="file_count">0</span>个文件，共<span class="file_size">0</span>KB。';
				demoHtml +=						'<input type="file"/>';
				demoHtml +=						'<button class="continue_sel">继续选择</button>';
				demoHtml +=						'<button class="uploadfile">开始上传</button>';
				demoHtml +=					'</div>';
				demoHtml +=				'</div>';
				demoHtml +=				'<div class="file_show">';
				demoHtml +=				'</div>';
			}else{
				setting.height < 50 && (setting.height = 50);
				$(item).addClass('noDrag');
				demoHtml +=		'<div class="file_info_handle">';
				demoHtml +=			'<div class="file_info">';
				demoHtml +=				'当前选择了<span class="file_count">0</span>个文件，共<span class="file_size">0</span>KB。';
				demoHtml +=				'<input type="file"/>';
				demoHtml +=				'<button class="continue_sel">继续选择</button>';
				demoHtml +=				'<button class="uploadfile">开始上传</button>';
				demoHtml +=			'</div>';
				demoHtml +=		'</div>';
				demoHtml +=		'<div class="file_show">';
				demoHtml +=			'<div class="sel_file_btn">';
				demoHtml +=				'<input type="file"/>';
				demoHtml +=				'<div class="sel_btn"></div>';
				demoHtml +=			'</div>';
				demoHtml +=		'</div>';
			}
			$(item).css({
				width : setting.width,
				height : setting.height
			});
			$(item).html(demoHtml);

			//获取DOM节点
			var fileArr = [],
			fileSize = 0,
			_this = $(item),
			selFileBtn = $('.file_sel .file_input .sel_file_btn input[type=file]', _this),
			fileCount = $('.file_info_handle .file_info .file_count', _this),
			fileSz = $('.file_info_handle .file_info .file_size', _this),
			cntSelFileBtn = $('.file_info_handle .file_info input[type=file]', _this),
			beginUpload = $('.file_info_handle .file_info .uploadfile', _this),
			fileShow = $('.file_show', _this),
			noDragSelFile = $('.file_show .sel_file_btn', _this),
			noDragSelFileBtn = $('.file_show .sel_file_btn input[type=file]', _this);

			setting.canDrag || fileShow.show();
			//是否可以多选
			if(setting.canMultiple){
				// var arr = [selFileBtn, cntSelFileBtn, noDragSelFileBtn];
				[selFileBtn, cntSelFileBtn, noDragSelFileBtn].forEach(function (item, i) {
					item.attr('multiple', 'multiple');
				})
			}

			//绑定事件
			[selFileBtn, cntSelFileBtn, noDragSelFileBtn].forEach(function (item, i) {
				item.on('change', selFile);
			});

			beginUpload.on('click', upLoadFile);

			// 选择文件
			function selFile () {
				var files = this.files;
				$(files).each(function (i, item) {
					fileArr.push(item);
					var fr = new FileReader();
					fr.readAsDataURL(item);
					fr.onload = function () {
						var imgDom = $('<span class="img_box"><span class="up_load_success" title="上传成功"></span><span class="img_handle"><span class="file_name" title="'+ item.name +'">'+ item.name +'</span><span class="icon-bin"></span></span><img src="'+ fr.result +'"/></span>');
						if(setting.canDrag){
							fileShow.css('display') === 'none' && fileShow.show();
							fileShow.append(imgDom);
						}else{
							fileShow.css('display') === 'none' && fileShow.show();
							noDragSelFile.before(imgDom);
						}
					}
				});
				fileCount.html(fileArr.length);
				fileSz.html(getFileInfo());
				//防止在删除了上次选择的文件后，再次选择相同的文件无效的问题。
				this.value ='';  
			}

			//上传文件
			function upLoadFile () {
				if(!fileArr.length){
					alert('请选择文件');
					return;
				}
				$(fileArr).each(function (i, item) {
					var formData = new FormData();
					formData.append('file', item);
					$.ajax({
					    url: 'file.php',
					    type: 'POST',
					    cache: false,
					    data: formData,
					    processData: false,
					    contentType: false
					}).done(function(res) {
						$('.img_box').eq(i).children('.up_load_success').show();
						console.log(res);
					}).fail(function(res) {
						alert('上传失败');
						console.log(res);
					});
				})
			}

			//计算文件信息
			function getFileInfo () {
				fileSize = 0;
				fileArr.forEach(function (item, i) {
					fileSize += item.size;
				})
				fileSize = (fileSize / 1024).toFixed(2);
				return fileSize;
			}

			fileShow.on('click', '.icon-bin' , function () {
				var index = $(this).parents('.img_box').index();
				$(this).parents('.img_box').remove();
				fileArr.splice(index, 1);
				fileCount.html(fileArr.length);
				fileSz.html(getFileInfo());
				!setting.canDrag || fileArr.length || fileShow.hide();
			})
		})
	}
})(jQuery)