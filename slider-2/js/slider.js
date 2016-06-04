(function ($) {
	$.fn.slider = function (setting) {  //给jQuery的实例对象绑定一个slider方法
		var defaultSetting = {
			width : 640,
			height : 270,
			during : 3000,
			speed : 500,
			btnSize : 30,
			btnSpace : 10,
			direction : 1
		}
		setting = $.extend(true, {}, defaultSetting, setting); //用传入的参数替换掉默认的设置  
		return this.each(function (i, item) {   
			var _setInterval = window.setInterval;  
			window.setInterval = function (callback, timer, param) {  //重写setInterval函数，让其可以传参
				var args = Array.prototype.slice.call(arguments, 2); 
				var _fn = function () {
					callback.apply(null, args);
				}
				return _setInterval(_fn, timer);
			}

			var _this = $(this),
			ulBox = $('.ul-box', this),
			ul = $('ul', this),
			li = $('li', ul),
			img = $('img', li),
			len = li.size(),
			mask = $('.mask', this),
			index = 0,    					//用来控制按钮的下标
			flag = true,  					//标识动画是否执行完成
			gap,          					//执行动画的按钮下标和当前按钮的下标的差
			timer;							//计时器

			_this.width(setting.width).height(setting.height);
			ulBox.width(setting.width * 3 * len).height(setting.height).css({
				marginLeft: -setting.width * len,
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
			var sliderBtn = $('.sliderBtn', this);
			ulBox.append(ulFir);
			ulBox.append(ulSec);
			sliderBtn.each(function (i, item) {
				$(item).css({
					width : setting.btnSize,
					height : setting.btnSize,
					top : setting.btnSpace,
					left : parseInt(setting.width - (setting.btnSize + setting.btnSpace *2) *len, 10) /2 + setting.btnSize * i + setting.btnSpace * i * 2 + setting.btnSpace
				});
				$(item).mouseenter(function () {
					gap = Math.abs(i - index);
					i > index ? (flag && ani(1, gap)) : (flag && ani(0, gap));
				})
			});
			btnAni(0);
			//按钮样式变化
			function btnAni (index) {
				sliderBtn.eq(index).addClass('current').siblings().removeClass('current');
			}
			//动画
			function ani (direction, num) {
				if(flag){
					//默认1向左运动，0向右运动
					flag = false;
					var ulfir = $('ul', ulBox).eq(0);
					var left = parseInt(ulfir.css('margin-left'), 10);
					if(direction){
						index += num;
						index = index % len;
						left = left - num * setting.width;
						ulfir.animate({
							marginLeft: left
						}, setting.speed, function () {
							if(left <= -len * setting.width){
								ulfir = ulfir.remove();     
								ulfir.css('margin-left', 0);
								ulBox.append(ulfir);
							}
							flag = true;
						});
					}else{
						index -= num;
						index = index <= -1 ? len - 1 : index;
						left = left + num * setting.width;
						ulfir.animate({
							marginLeft: left
						}, setting.speed, function () {
							if(left >= len * setting.width){
								var ulLast = $('ul', ulBox).eq(2).remove();
								ulLast.css('margin-left', 0);
								ulBox.prepend(ulLast);
								ulfir.css('margin-left', 0);
							}
							flag = true
						})
					}
					btnAni(index)
				}
			}
			//定时器
			timer = setInterval(ani, setting.during, setting.direction, 1);
			_this.hover(function () {
				$('.prev, .next', this).css('display', 'block');
				clearInterval(timer);
			}, function () {
				$('.prev, .next', this).css('display', 'none');
				timer = setInterval(ani, setting.during, setting.direction, 1);
			})
			$('.next').click(function () {
				flag && ani(1, 1);
			})
			$('.prev').click(function () {
				flag && ani(0, 1);
			})
		})
	}
})(jQuery)