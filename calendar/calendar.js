;(function ($) {
    $.fn.lwCalendar = function (option) {
        switch (option.viewLevel) {
                case 'baseWeek':
                    baseWeek(option, this);
                    break;
                case 'baseMonth':
                    baseMonth(option, this);
                    break;
                case 'baseDay':
                    baseDay(option, this);
                    break;
                default:
                    baseWeek(option, this);
                    break;
            }    
    };
    // 周显示视图
    function baseWeek (option, _this) {
        let defaultSetting = {
            _this: _this,
            defaultDay: new Date(),
            height: 100,
            width: 700,
            // 翻页，每次移动多少行
            pagingNum: 3,
            // 翻页的速度、间隔
            pagingSpeed: 500,
            pagingInterval: 5000,
            // 滚动的速度
            rollingSpeed: 50,
            eventsRenderCb: function () {

            },
            events: []
        };
        option = $.extend({}, true, defaultSetting, option);
        let itemHeight = Math.floor(option.height / 4);
        let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        /**
         * 根据传入的时间戳计算出这个时间的本周
         * @param  string   date   传入的时间，根据他来计算出本周的日期
         * @param  boolean  year   返回的数据是否带有年份
         * @return {[type]}     [description]
         */
        function getCurrentWeek(date, year) {
            let time, 
                result = [[], []], 
                d = new Date(date).getDay();
            for(var i = -6; i < 7; i++){
                time = new Date(date).getTime();
                time = time + i * 24 * 3600 * 1000;
                if(i <= 0){
                    result[0].push(parseDay(time, year ? true : false));
                }
                if(i >= 0){
                    result[1].push(parseDay(time, year ? true : false));
                }
            }  
            if(i === 7){
                result[0].reverse().length = d + 1;
                result[1].length = 7 - d;
            }
            result[1].shift();
            return result[0].reverse().concat(result[1])
        }
        /**
         * 根据传入的时间戳来格式化时间 星期 月-日
         * @param  number  day  时间戳
         * @param  boolean year 是否返回含有年份的日期
         * @return string     包含年份：2017-01-01  不包含年份：星期天 01-01
         */
        function parseDay (day, year) {
            day = new Date(day);
            let month = day.getMonth() < 9 ? '0' + (day.getMonth() + 1) : day.getMonth() + 1;
            let date = day.getDate() < 10 ? '0' + day.getDate() : day.getDate();
            if(year){
                return day.getFullYear() + '-' + month + '-' + date;
            }else{
                return week[day.getDay()] + ' ' + month + '-' + date;
            }
        }
        /**
         * 根据events添加事件
         * @param object option 传入的参数对象
         */
        function addEvent (option) {
            if(!option.events.length){
                return;
            }
            let date, td, th, firstSpan, firstLi, liLen;
            option.events.forEach(function (item, index) {
                date = parseDay(item.date, true);
                th = $(_this).find('th.' + date);
                if(th.length){
                    td = $(_this).find('>table td').eq(th.index());
                    if(td.html() === ''){
                        td.append($('<ul class="eventsUl"></ul>'));
                    }
                    td.find('ul.eventsUl').append('<li><span>' + item.content + '</span></li>');
                }
                if(index === option.events.length - 1){
                    // $(_this).find('.eventsUl>li').each(function (i, ele) {
                    //     ele = $(ele);
                    //     ele.css('top', ele.index() * itemHeight + 'px');
                    //     // 如果内容宽度大于容器li的宽度，就滚动
                    //     if(ele.find('>span').width() > ele.width()){
                    //         ele.html(ele.html() + ele.html());
                    //         setInterval(function () {
                    //             firstSpan = ele.find('>span').eq(0);
                    //             firstSpan.css('margin-left', parseInt(firstSpan.css('margin-left'))-1+'px')
                    //             if(-parseInt(firstSpan.css('margin-left')) >= firstSpan.width() + parseInt(firstSpan.css('margin-right'))){
                    //                 ele.append(firstSpan.remove().css('margin-left', 0));
                    //             }
                    //         }, option.rollingSpeed);
                    //     }
                    // });
                    // $(_this).find('.eventsUl').each(function (num, element) {
                    //     element = $(element);
                    //     liLen = element.find('>li').length;
                    //     if(liLen > option.pagingNum){
                    //         setInterval(function () {
                    //             element.find('>li').each(function (n, e) {
                    //                 e = $(e);
                    //                 e.animate({
                    //                     top: parseInt(e.css('top')) - option.pagingNum * itemHeight + 'px'
                    //                 }, option.pagingSpeed, function () {
                    //                     if(parseInt(e.css('top')) <= -itemHeight){
                    //                         element.append(e.css('top', element.find('>li').length * itemHeight + parseInt(e.css('top')) + 'px'));
                    //                     }
                    //                 });
                    //             });
                    //         }, option.pagingInterval);
                    //     }
                    // })
                    option.eventsRenderCb();
                }
            });
        }

        /**
         * 生成日历对象, 并且初始化一些日历表格的样式
         * @return {[type]} [description]
         */
        function createCalendarTb () {
            let str = '';
                str += '<table class="calendarTable" cellspacing=0>';
                str +=     '<thead>';
                str +=         '<tr>';
                getCurrentWeek(option.defaultDay, true).forEach(function (item, index) {
                    str += '<th class=' + item + '>';
                    str += getCurrentWeek(option.defaultDay)[index];
                    str += '</th>';
                });
                str +=          '</tr>';
                str +=     '</thead>';
                str +=     '<body>';
                str +=         '<tr>';
                str +=             '<td>';
                str +=             '</td>';
                str +=             '<td>';
                str +=             '</td>';
                str +=             '<td>';
                str +=             '</td>';
                str +=             '<td>';
                str +=             '</td>';
                str +=             '<td>';
                str +=             '</td>';
                str +=             '<td>';
                str +=             '</td>';
                str +=             '<td>';
                str +=             '</td>';
                str +=         '</tr>';
                str +=     '</body>';
                str += '</table>';
            $(_this).css('width', option.width + 'px').css('height', option.height + 'px').html(str);
            $(_this).find('>table td, >table th').css('width', Math.floor(option.width / 7) + 'px');
            $(_this).find('>table thead').css('height', itemHeight + 'px');
            $(_this).find('>table tbody td').css('height', itemHeight * 3 + 'px');
        }
        //生成日历表格
        createCalendarTb();
        // 添加事件
        addEvent(option);
    }
    // 月显示视图
    function baseMonth (option, _this) {

    }
    // 日显示视图
    function baseDay(option, _this) {
         /* body... */ 
    }
}(jQuery));