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
			//重写setInterval函数，让其可以传参
			var _setInterval = window.setInterval;
			window.setInterval = function (callback, timer, param) {
				var args = Array.prototype.slice.call(arguments,2); 
				var _fn = function () {
					callback.apply(null, args);
				}
				_setInterval(_fn, timer);
			}

			var _this = $(this),
			ulBox = $('.ul-box', this),
			ul = $('ul', this),
			li = $('li', ul),
			img = $('img', li),
			len = li.size(),
			mask = $('.mask', this),
			index = 0,
			flag = true,
			timer,
			gap;
			_this.width(setting.width).height(setting.height);
			ulBox.width(setting.width * 3 * len).height(setting.height).css({
				marginLeft: -setting.width * len
			});
			ul.width(setting.width * len).height(setting.height);
			img.width(setting.width).height(setting.height);
			mask.height(setting.btnSize + 2 * setting.btnSpace);
			//添加btn
			for(var i = 0, str = ''; i < len; i++){
				str += '<div class="sliderBtn"></div>';
			}
			mask.html(str);
			var ulFir = ul.clone(true);
			var ulSec = ul.clone(true);
			ulBox.append(ulFir);
			ulBox.append(ulSec);
			$('.sliderBtn', '.mask').each(function (i, item) {
				$(item).css({
					width : setting.btnSize,
					height : setting.btnSize,
					top : setting.btnSpace,
					left : parseInt(setting.width - (setting.btnSize + setting.btnSpace *2) *len, 10) /2 + setting.btnSize * i + setting.btnSpace * i * 2 + setting.btnSpace
				})
				$(item).mouseenter(function () {
				})
			});
			btnAni(0);
			//按钮样式变化
			function btnAni (index) {
				$('.sliderBtn').css('background', 'radial-gradient(white 20%, transparent 50%)');
				$('.sliderBtn').eq(index).css('background', 'radial-gradient(white 10%, transparent 30%, white 70%)');
			}
			//动画
			function ani (direction, num) {
				//默认1向左运动，0向右运动
				if(direction){
					index += num;
					index = index % len;
					var ulfir = $('ul', ulBox).eq(0);
					var left = parseInt(ulfir.css('margin-left'), 10);
					left = left - num * setting.width;
					ulfir.animate({
						marginLeft: left
					}, setting.speed, function () {
						if(left <= -len * setting.width){
							ulfir = ulfir.remove();
							ulfir.css('margin-left', 0);
							ulBox.append(ulfir);
						}
					});
				}else{
					index -= num;
					index = index <= -1 ? len - 1 : index;
					var ulfir = $('ul', ulBox).eq(0);
					var left = parseInt(ulfir.css('margin-left'), 10);
					left = left + num * setting.width;
					ulfir.animate({
						marginLeft: left
					}, setting.speed, function () {
						if(left >= 0){
							ulfir = $('ul', ulBox).eq(2).remove();
							ulfir.css('margin-left', - len * setting.width);
							ulBox.prepend(ulfir);
						}
					});
				}
			}
			//定时器
			timer = setInterval(ani, setting.during, 0, 1);
			_this.hover(function () {
				$('.prev', this).css('display', 'block');
				$('.next', this).css('display', 'block');
				// clearInterval(timer);
			}, function () {
				$('.prev', this).css('display', 'none');
				$('.next', this).css('display', 'none');
				timer = setInterval(ani, setting.during, 1, 1);
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