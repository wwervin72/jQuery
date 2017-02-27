/**
 * 对滚动效果以及翻页(幻灯片)的一个简单封装
 * 2017-02-24
 * author: ervin
 */
;(function ($) {
    // 滚动
    $.fn.lwRolling = function (option) {
        let _this = $(this);
        let defaultSetting = {
            item: '', //滚动元素(选择器)
            direction: 'left', //滚动的方向 上下左右 top left bottom right,
            speed: 500,  //滚动的速度
        };
        option = $.extend(true, {}, defaultSetting, option);
        let item = _this.find('>' + option.item);
        let direction = option.direction;
        // 水平移动还是垂直移动
        let levelAni = ['left', 'right'].indexOf(direction) !== -1;
        let timer;
        if(item.length >= 2){
            let distance, addDomPosition, refreshItem;
            setStyle();
            timer = setInterval(animation, option.speed);
            _this.hover(function () {
                timer && clearInterval(timer);
            }, function () {
                timer = setInterval(animation, option.speed);
            });
            function setStyle () {
                let distance = 0;
                _this.css({
                    overflow: 'hidden',
                    position: 'relative',
                    // height: item.outerHeight()
                });
                item.each(function (i, ele) {
                    ele = $(ele);
                    ele.css({
                        position: 'absolute'
                    });
                    if(ele.prev().length){
                        distance = distance + (levelAni ? ele.prev().outerWidth() : ele.prev().outerHeight());
                    }
                    ele.css(direction, distance + 'px');
                })
            }
            function animation () {
                item.each(function (index, element) {
                    element = $(element);
                    distance = levelAni ? element.outerWidth() : element.outerHeight();
                    element.css(direction, parseInt(element.css(direction)) - 1 + 'px');
                    if(-parseInt(element.css(direction)) >= distance){
                        refreshItem = _this.find('>' + option.item);
                        addDomPosition = parseInt(refreshItem.last().css(direction)) + (levelAni ? refreshItem.last().outerWidth() : refreshItem.last().outerHeight());
                        _this.append(element.remove().css(direction, addDomPosition + 'px'));
                    }
                });  
            }
        }else if(item.length === 1){
            // 如果里面滚动元素只有一个，就需要动态添加一个相同的
            item = _this.find('>' + option.item).eq(0);
            // 水平移动间距就是宽度，垂直就是高度
            let distance =  levelAni ? item.outerWidth(true) : item.outerHeight(true);
            // 设置样式
            setStyle();
            timer = setInterval(animation, option.speed);
            _this.hover(function () {
                timer && clearInterval(timer);
            }, function () {
                timer = setInterval(animation, option.speed);
            });
            function setStyle() {
                _this.css({
                    whiteSpace: levelAni ? 'nowrap' : 'normal',
                    overflow: 'hidden',
                    position: 'relative'
                });
                option.height && _this.css('height', option.height + 'px');
                option.width && _this.css('width', option.width + 'px');
                item.css({
                    position: 'absolute',
                    display: levelAni ? 'inline !important' : 'block'
                });
                item.css(option.direction, 0);
                _this.append(item.clone().css(direction, distance + 'px'));
            }
            function animation () {
                _this.find('>' + option.item).each(function (index, items) {
                    items = $(items);
                    items.css(direction, parseInt(items.css(direction)) - 1 + 'px');
                    if(Math.abs(parseInt(items.css(direction))) >= distance){
                        if(['left', 'top'].indexOf(option.direction) !== -1){
                            _this.append(items.remove().css(direction, distance + 'px'));
                        }else{
                            _this.prepend(items.remove().css(direction, distance + 'px'));
                        }
                    }
                });
            }
        }else{
            throw new Error('未找到滚动元素');
        }
    };
    // 翻页
    $.fn.lwSliding = function (option) {
        let _this= $(this);
        let defaultSetting = {
            direction: 'left',
            item: '',
            num: 3,
            speed: 500,
            space: 3000
        };
        option = $.extend(true, {}, defaultSetting, option);
        let direction = option.direction;
        let distance, addDomPosition, refreshItem;
        let levelAni = ['left', 'right'].indexOf(direction) !== -1;
        let item = _this.find('>' + option.item);
        // _this的总宽度，用来求删除后再在末尾添加dom的position
        let _thisWidth = 0;
        item.each(function (i, e) {
            _thisWidth += levelAni ? $(e).outerWidth() : $(e).outerHeight();
        });
        let timer;
        if(option.num >= item.length){
            throw new Error('每次滚动的单位数量，必须要小于列表数');
        }
        // 设置样式
        setStyle();
        // 定时器
        timer = setInterval(animation, option.space);
        _this.hover(function () {
            timer && clearInterval(timer);
        }, function () {
            timer = setInterval(animation, option.space);
        });
        function setStyle () {
            let distance = 0;
            _this.css({
                position: 'relative'
            });
            item.css({
                position: 'absolute'
            });
            item.each(function (index, item) {
                item = $(item);
                if(item.prev().length){
                    distance = distance + (levelAni ? item.prev().outerWidth() : item.prev().outerHeight());
                }
                item.css(direction, distance + 'px');
            })
        }
        let aniTarget = {};
        function animation () {
            item.each(function (index, ele) {
                ele = $(ele);
                refreshItem = _this.find('>' + option.item);
                distance = levelAni ? ele.outerWidth() : ele.outerHeight();
                // 高度或者宽度不同的算法
                // aniTarget[direction] = parseInt(ele.css(direction)) - parseInt(refreshItem.eq(option.num).css(direction)) + 'px';
                // 每一个滚动元素的宽度(水平滚动)高度(垂直滚动)的大小相同
                aniTarget[direction] = parseInt(ele.css(direction)) - distance * option.num + 'px';
                ele.animate(aniTarget, option.speed, function () {
                    if(-parseInt(ele.css(direction)) >= distance){
                        addDomPosition = _thisWidth - Math.abs(parseInt(ele.css(direction)));
                        _this.append(ele.remove().css(direction, addDomPosition + 'px'));
                    }
                });
            });
        }
    };
}(jQuery))