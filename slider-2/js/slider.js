(function ($) {
	$.fn.slider = function (setting) {
		var defaultSetting = {
			width : 640,
			height : 270,
			during : 3000,
			speed : 500,
			btnSize : 20,
			btnSpace : 10,
			direction : 1
		}
		setting = $.extend(true, {}, defaultSetting, setting);
		return this.each(function (i, item) {
			var _this = $(this),
			ul = $('ul', this),
			li = $('li', ul),
			img = $('img', li),
			len = li.size(),
			mask = $('.mask', this),
			index = 0,
			flag = true,
			aniFn = setting.direction ? aniLeft : aniRight,
			removeLi,
			timer,
			gap;
			_this.width(setting.width).height(setting.height);
			ul.width(setting.width * len).height(setting.height);
			img.width(setting.width).height(setting.height);
			mask.height(setting.btnSize + 2 * setting.btnSpace);
			//添加btn
			for(var i = 0, str = ''; i < len; i++){
				str += '<div class="sliderBtn"></div>';
			}
			mask.html(str);
			$('.sliderBtn', '.mask').each(function (i, item) {
				$(item).css({
					width : setting.btnSize,
					height : setting.btnSize,
					top : setting.btnSpace,
					left : parseInt(setting.width - (setting.btnSize + setting.btnSpace *2) *len, 10) /2 + setting.btnSize * i + setting.btnSpace * i * 2 + setting.btnSpace
				})
				$(item).mouseenter(function () {
					
					i = $(this).index();
					// var fn = index > i ? aniRight : aniLeft;
					gap = Math.abs(index - i);
					ml = li.eq(0).css('margin-left');
					if(index > i){
						li.css('margin-left', ml + setting.width * gap * )
					}
				})
			});
			btnAni(0);
			//按钮样式变化
			function btnAni (index) {
				$('.sliderBtn').css('background', 'radial-gradient(white 20%, transparent 50%)');
				$('.sliderBtn').eq(index).css('background', 'radial-gradient(white 10%, transparent 30%, white 70%)');
			}
			//动画
			function aniLeft () {
				index++;
				index = index % len;
				li = $('li', ul);
				if(flag){
					flag = false;
					btnAni(index);
					li.eq(0).animate({marginLeft : -setting.width}, setting.speed, function () {
						flag = true;
						removeLi = li.eq(0).remove();
						removeLi.removeAttr('style');
						ul.append(removeLi);
					})
				}
			}
			function aniRight () {
				index--;
				index = index === -1 ? (len - 1) : index;
				li = $('li', ul);
				if(flag){
					flag = false;
					btnAni(index);
					removeLi = li.eq(len - 1).remove();
					removeLi.css('marginLeft', -setting.width);
					ul.prepend(removeLi);
					li = $('li', ul);
					li.eq(0).animate({marginLeft : 0}, setting.speed, function () {
						flag = true;
					})
				}
			}
			//定时器
			timer = setInterval(aniFn, setting.during);
			_this.hover(function () {
				$('.prev', this).css('display', 'block');
				$('.next', this).css('display', 'block');
				clearInterval(timer);
			}, function () {
				$('.prev', this).css('display', 'none');
				$('.next', this).css('display', 'none');
				timer = setInterval(aniFn, setting.during);
			})
			$('.next').click(function () {
				flag && aniLeft();
			})
			$('.prev').click(function () {
				flag && aniRight();
			})

		})
	}
})(jQuery)