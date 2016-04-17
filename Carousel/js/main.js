;(function($){
	var Carousel = function(poster){
		var self = this;
		//保存单个旋转木马对象
		this.poster = poster;
		//保存放置播放幻灯片的按钮的div
		this.box = poster.find('#selBtn');
		//保存ul
		this.posterItemMain = poster.find('ul.poster-list');
		//保存btn
		this.prevBtn = poster.find('div.prev_btn');
		this.nextBtn = poster.find('div.next_btn');
		//幻灯片个数
		this.posterItems = poster.find('li.poster-item');
		if(this.posterItems.size()%2 == 0){  //偶数张
			this.posterItemMain.append(this.posterItemMain.eq(0).clone());  //克隆第一个并且添加到ul里面，让li的个数变为奇数
			this.posterItems = this.posterItemMain.children();
		}		
		//保存第一个幻灯片
		this.posterFirstItem = this.posterItems.first();
		//保存最后一帧幻灯片
		this.posterLastItem = this.posterItems.last();
		//旋转标示
		this.rotateFlag = true;
		// 设置默认参数配置
		this.setting = {
			"width" : 800,   //幻灯片的宽高
			"height" : 270,
			"posterWidth" : 640,   //幻灯片第一帧的宽高
			"posterHeight" : 270,
			"scale" : 0.85,
			"verticalAlign" : "middle",
			"autoPlay" : true,
			"speed" : 500,
			"delay" : 3000
		};
		$.extend(this.setting,this.getSetting());  //用用户添加的属性替换默认的属性，有就替换，没有就添加
		this.setSettingValue();
		this.setPosterPos();

		//生成下方切换幻灯片的按钮
		this.switchSlideBtn();

		//绑定切换幻灯片事件
		this.nextBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouselRotate('left');
				self.switchSlideBtnStyle();
			}
		});
		this.prevBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouselRotate('right');
				self.switchSlideBtnStyle();
			}
		});
		//是否开启自动播放
		if(self.setting.autoPlay){
			this.autoPlay();
			this.poster.hover(function(){// 移进来
				window.clearInterval(self.timer);
			},function(){//移出去

				self.autoPlay();
			});
		}
		this.switchSlideBtnStyle();
		$('#selBtn .btn').each(function(){
			$(this).hover(function(){
				if(self.rotateFlag){
					self.switchSlide(this);
				}
			},function(){
			});
		})
	};



	Carousel.prototype = {

		//生成切换幻灯片的按钮
		switchSlideBtn : function(){
			var slideNum = this.posterItems.size();
			var str = '';
			var firstBtnLeft = (this.setting.width-(slideNum-1)*15-slideNum*15)/2;
			for(var i = 0; i<slideNum; i++){
				str += '<button class="btn"></button>';
			}
			$('#selBtn').html(str);	
			for(var i = 0;i<slideNum; i++){
				$('#selBtn .btn').eq(i).css('left' , firstBtnLeft+i*30);
			}		
		},

		//用切换幻灯片的按钮切换幻灯片的方法
		switchSlide : function(btn){
			var self = this;
			var BtnIndex = $(btn).index();
			$('#selBtn .btn').css('background','rgba(255,255,255,.3)');
			$('#selBtn .btn').eq(BtnIndex).css('background','rgba(255,255,255,1)');
			var level = Math.floor(this.posterItems.size()/2),
			posterItemsLength = this.posterItems.size(),
			index;
			$('.poster-item').filter(function(i,item){
				if($(this).css('z-index') == level){
					index = i;
				}
			});
			var nextTime = BtnIndex-index;  //向左旋转nextTime次
			var arr = [],zIndexArr=[];
			for(var i = 0;i < posterItemsLength;i++){
				arr.push(i);  
			}
			arr = arr.concat(arr);  //添加一个数组，用来模拟Li的下标
			if(nextTime > 0){   //prev 左旋转,把数组的后半部分向前移动nextTime个下标
				self.rotateFlag = false;
				this.posterItems.each(function(i, item){
					var posterItemIndex = arr.lastIndexOf(i);  //获得li节点在arr中对应的下标
					var tag = $(self.posterItems[arr[posterItemIndex-nextTime]]),
					width = tag.width(),
					height = tag.height(),
					zIndex = tag.css('zIndex'),
					opacity = tag.css('opacity'),
					left = tag.css('left'),
					top = tag.css('top');
					zIndexArr.push(zIndex);
					$(item).animate({
						width : width,
						height : height,
						opacity : opacity,
						left : left,
						top : top
					},self.setting.speed,function(){
						self.rotateFlag = true;
					});
				});
				self.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i]);
				});
			}

			if(nextTime < 0){  //next 右旋转,把数组的前半部分向后移动nextTime的绝对值个下标
				self.rotateFlag = false;
				this.posterItems.each(function(i, item){
					var posterItemIndex = arr.indexOf(i),  //获得li节点在arr中对应的下标
					tag = $(self.posterItems[arr[posterItemIndex+Math.abs(nextTime)]]),
					width = tag.width(),
					height = tag.height(),
					zIndex = tag.css('zIndex'),
					opacity = tag.css('opacity'),
					left = tag.css('left'),
					top = tag.css('top');
					zIndexArr.push(zIndex);
						$(item).animate({
						width : width,
						height : height,
						opacity : opacity,
						left : left,
						top : top
					},self.setting.speed,function(){
						self.rotateFlag = true;	
					});
				});
				self.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i]);
				});
			}
		},

		//切换幻灯片的按钮演示改变方法
		switchSlideBtnStyle : function(){
			var level = Math.floor(this.posterItems.size()/2),
			index;
			$('.poster-item').filter(function(i,item){
				if($(this).css('z-index')==level){
					index = i;
				}
			});
			$('#selBtn .btn').css('background','rgba(255,255,255,.3)');
			$('#selBtn .btn').eq(index).css('background','rgba(255,255,255,1)');
		},

		//旋转函数
		carouselRotate : function(type){
			var _this_ = this,
			zIndexArr = [];
			if(type == 'left'){
				//执行左旋转
				this.posterItems.each(function(){

					var self = $(this),
					prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
					width = prev.width(),
					height = prev.height()
					zIndex = prev.css('zIndex'),
					opacity = prev.css('opacity'),
					left = prev.css('left'),
					top = prev.css('top');
					zIndexArr.push(zIndex);
					self.animate({
						width : width,
						height : height,
						opacity : opacity,
						left : left,
						top : prev.css('top')
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});
				});
				this.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i]);
				});
			}else if(type == 'right'){
				//右旋转
				this.posterItems.each(function(){

					var self = $(this),
					next = self.next().get(0)?self.next():_this_.posterFirstItem,
					width = next.width(),
					height = next.height()
					zIndex = next.css('zIndex'),
					opacity = next.css('opacity'),
					left = next.css('left'),
					top = next.css('top');
					zIndexArr.push(zIndex);
					self.animate({
						width : width,
						height : height,
						opacity : opacity,
						left : left,
						top : next.css('top')
					},_this_.setting.speed,function(){
					_this_.rotateFlag = true;
					});
				});
				this.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i]);
				});
			}
		},

		//自动执行函数
		autoPlay : function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			},this.setting.delay);
		},

		//获取人工配置参数
		getSetting : function(){
			var setting = $(this.poster).attr('data-setting');
			if(setting&&setting!=''){
				return $.parseJSON(setting);
			}else{
				return {};
			}
		},	
		//设置配置参数值去控制基本的宽度高度
		setSettingValue : function(){
			this.poster.css({
				width : this.setting.width,
				height : this.setting.height
			});
			this.box.css({
				zIndex : Math.ceil(this.posterItems.size()/2)
			});
			this.posterItemMain.css({
				width : this.setting.width,
				height : this.setting.height
			});
			var width = (this.setting.width-this.setting.posterWidth)/2;
			this.prevBtn.css({
				width : width,
				height : this.setting.height,
				zIndex : Math.ceil(this.posterItems.size()/2)
			});
			this.nextBtn.css({
				width : width,
				height : this.setting.height,
				zIndex : Math.ceil(this.posterItems.size()/2)
			});
			this.posterFirstItem.css({
				width : this.setting.posterWidth,
				height : this.setting.posterHeight,
				left : width,
				zIndex : Math.floor(this.posterItems.size()/2)
			});
		},	
		//设置剩余帧的位置
		setPosterPos : function(){
			var self = this;

			var sliceItems = this.posterItems.slice(1),
			sliceSize = sliceItems.size()/2,
			rightSlice = sliceItems.slice(0,sliceSize),
			leve = Math.floor(this.posterItems.size()/2)
			leftSlice = sliceItems.slice(sliceSize);

			//设置右边帧的位置关系、宽度、高度、top
			var rw = this.setting.posterWidth,
			rh = this.setting.posterHeight,
			gap = (this.setting.width-this.setting.posterWidth)/2/leve;  

			var firstLeft = (this.setting.width-this.setting.posterWidth)/2;
			var fixOffsetLeft = firstLeft+rw;
			// 设置右边帧的位置关系、宽度、高度、top
			rightSlice.each(function(i){
				leve--;
				rw = rw*self.setting.scale;
				rh = rh*self.setting.scale;

				var j = i;

				$(this).css({
					zIndex : leve,
					width : rw,
					height : rh,
					opacity : 1/(++i),
					left : fixOffsetLeft+(++j)*gap-rw,
					top : self.setVertucalAlign(rh)
				});
			});
			//设置左边的位置关系
			var lw = rightSlice.last().width(),
			lh = rightSlice.last().height(),
			oloop = Math.floor(this.posterItems.size()/2);
			leftSlice.each(function(i){
				$(this).css({
					zIndex : i,
					width : lw,
					height : lh,
					opacity : 1/oloop,
					left : i*gap,
					top : self.setVertucalAlign(lh)
				});
				lw /=self.setting.scale;
				lh /=self.setting.scale;
				oloop--;
			});
		},
		setVertucalAlign : function(height){
			var verticalType = this.setting.verticalAlign,
			top = 0;
			if(verticalType == 'middle'){
				top = (this.setting.height-height)/2;
			}else if(verticalType == 'bottom'){
				top = this.setting.height-height;
			}else if(verticalType == 'top'){
				top = 0;
			}else{
				top = (this.setting.height-height)/2;
			}
			return top;
		}
	};

	Carousel.init = function(param, /*optional*/setting){
		param.each(function(i,item){
			new Carousel($(item));
		});
	}

	window.Carousel = Carousel;
})(jQuery);