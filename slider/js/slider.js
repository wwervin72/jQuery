(function ($) {
	$.fn.slider = function (setting) {
		var defaultSetting = {
			width : 640,
			height : 270,
			during : 3000,
			speed : 500,
			btnWidth : 20,
			btnSpace : 10
		};
		setting = $.extend(true, {}, defaultSetting, setting);
		return $(this).each(function () {
			var _this = $(this),
			ul = $('ul', this),
			li = $('li', ul),
			len = li.size(),
			btnBox = $('.btnBox', this),
			btn = $('<div class="sliderBtn"></div>'),
			index = 0,
			timer,
			aniFin = true;
			_this.width(setting.width).height(setting.height).css({
				width : setting.width,
				height : setting.height
			});
			ul.width(setting.width * len).height(setting.height);
			li.width(setting.width).height(setting.height).css({
				float : 'left'
			});
			$('img', li).css({
				width : setting.width,
				height : setting.height
			});
			btnBox.css({
				height : setting.btnWidth + 2 * setting.btnSpace
			}) 
			for(var i = 0 , sliderBtn, btnArr = []; i < len; i++){
				sliderBtn = $('<div class="sliderBtn"></div>');
				sliderBtn.css({
					width : setting.btnWidth,
					height : setting.btnWidth,
					left : (setting.width - (2 * setting.btnSpace + setting.btnWidth) * len) / 2 + setting.btnSpace * (i * 2 + 1) + setting.btnWidth * i,
					top : setting.btnSpace
				})
				btnBox.append(sliderBtn);
			}
			$('.sliderBtn').eq(0).css('opacity', 1);
			//运动
			function ani (btnIndex) {
				if(aniFin){
					aniFin = false;
					index++;
					index = btnIndex || index % len;
					btnAni(index);
					ul.animate({'left': -index * setting.width}, setting.speed, function () {
						aniFin = true;
					});
				}
			}
			//按钮变化
			function  btnAni(btnIndex) {
				$('.sliderBtn').css('opacity', 0.3);
				$('.sliderBtn').eq(btnIndex).css('opacity', 1);
			}
			//自行运动
			timer = setInterval(function () {
				ani();
			}, setting.during);
			_this.hover(function () {
				clearInterval(timer);
				$('.prev', this).css('display', 'block');
				$('.next', this).css('display', 'block');
			}, function () {
				$('.prev', this).css('display', 'none');
				$('.next', this).css('display', 'none');
				timer = setInterval(ani, setting.during);
			});
			$('.sliderBtn').each(function (i, item) {
				$(item).mouseenter(function () {
					if(aniFin){
						aniFin = false;
						index = i;
						btnAni(i);
						ul.animate({'left': -i * setting.width}, setting.speed, function () {
							aniFin = true;
						});
					}
				})
			});
			$('.next').click(function () {
				ani();
			})
			$('.prev').click(function () {
				if(aniFin){
					aniFin = false;
					index--;
					index = index == -1 ? (len - 1) : index;
					btnAni(index);
					ul.animate({'left': -index * setting.width}, setting.speed, function () {
						aniFin = true;
					});
				}
			})
		})	
	}
})(jQuery)