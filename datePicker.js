/**
 * @file datePicker.js - a simple jQuery plugin to pick date
 * @author Marx
 *
 * 将date.css和datePicker.js引入页面
 * Example：
 * HTML:
 *     <input type="text" id="date" readonly>
 * JS:
 *     $('#date').datePicker();
 */
(function ($) {

    /**
     * 日期控件定位元素的Dom
     *
     * @const
     * @type {string}
     */
    var DATE_HOLDER = '<div class="date-holder"></div>';

    /**
     * 日期控件头部Dom
     *
     * @const
     * @type {string}
     */
    var CALENDAR_HEADER = ''
        + '<div class="date-box">'
        +     '<div class="date-header">'
        +         '<ul>'
        +             '<li class="date-pre"><</li>';

    /**
     * 日期控件星期标志部分Dom，为了格式对应，保留缩进
     *
     * @const
     * @type {string}
     */
    var CALENDAR_DAY = ''
        +             '<li class="date-next">></li>'
        +         '</ul>'
        +     '</div>'
        +     '<div class="date-day">'
        +         '<ul>'
        +             '<li>日</li>'
        +             '<li>一</li>'
        +             '<li>二</li>'
        +             '<li>三</li>'
        +             '<li>四</li>'
        +             '<li>五</li>'
        +             '<li>六</li>'
        +         '</ul>'
        +     '</div>'
        +     '<div class="date-body">'
        +         '<ul>';

    /**
     * 日期控件底部Dom
     *
     * @const
     * @type {string}
     */
    var CALENDAR_FOOTER = ''
        +         '</ul>'
        +     '</div>'
        +     '<div class="date-footer">'
        +         '<ul>'
        +             '<li class="date-clear">清空</li>'
        +             '<li class="date-today">今天</li>'
        +             '<li class="date-close">关闭</li>'
        +         '</ul>'
        +     '</div>'
        +  '</div>';

    /**
     * 时间选择类
     *
     * @class
     * @param {Object} targetInput 调用插件的jQuery对象
     */
    function DatePicker(targetInput) {

        /**
         * 控件中用到的jQuery对象
         *
         * @type {Object}
         * @private
         */
        this.dom = {

            /**
             * 控件对应文本框的jQuery对象
             *
             * @type {Object}
             * @private
             */
            targetInput: targetInput
        };

        // 将日期控件定位元素插入dom中
        this.dom.targetInput.after(DATE_HOLDER);

        /**
         * 日期控件定位元素的jQuery对象
         *
         * @type {Object}
         * @private
         */
        this.dom.dateHolder = this.dom.targetInput.next();

        /**
         * 当前对象中记录的日期
         *
         * @type {Date}
         * @private
         */
        this.activeDate = new Date();

        /**
         * 记录日期插件的位置
         *
         * @type {Object}
         * @private
         */
        this.position = {

            /**
             * 记录日期插件的水平位置
             *
             * @type {number}
             * @private
             */
            x: this.dom.targetInput.offset().left,

            /**
             * 记录日期插件的顶部位置
             *
             * @type {number}
             * @private
             */
            y: this.dom.targetInput.offset().top + this.dom.targetInput.outerHeight()
        };

        // 初始化时间插件
        this.init();
    }

    DatePicker.prototype = {

        /**
         * 修正constructor
         *
         * @type {Object}
         * @private
         */
        constructor: DatePicker,

        /**
         * 初始化时间插件函数
         *
         * @private
         */
        init: function () {
            this.setYearMonthDate(this.activeDate);
            this.setDateHolder();
            this.blindEvent();
        },

        /**
         * 设置日期框的位置
         *
         * @private
         * @param {number} x 日期框对应文本框的offsetTop值
         * @param {number} y 日期框对应文本框的offsetLeft值
         */
        setDateHolder: function () {
            this.dom.dateHolder.css({left: this.position.x, top: this.position.y});
            this.dom.dateHolder.hide();
        },

        /**
         * 获取给定年月的当月总天数
         *
         * @private
         * @param {number} year 给定年份
         * @param {number} month 给定月份
         * @return {number} 当月天数
         */
        getDaysOfMonth: function (year, month) {
            var daysOfFab = 28;
            if (month === 2) {
                if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                    daysOfFab = 29;
                }
            }
            return [31, daysOfFab, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        /**
         * 获取给日期的年月日
         *
         * @private
         * @param {Date} sourseDate 给定日期
         */
        setYearMonthDate: function (sourseDate) {
            this.year = sourseDate.getFullYear();
            this.month = sourseDate.getMonth();
            this.day = sourseDate.getDate();
        },

        /**
         * 获取给定年月当月第一天是星期几
         *
         * @private
         * @param {number} year 给定年份
         * @param {number} month 给定月份
         * @return {number} 返回当月第一天是星期几：0 ~ 6
         */
        getDayOfFirstDate: function (year, month) {
            var firstDate = new Date(year, month, 1);
            return firstDate.getDay();
        },

        /**
         * 返回给定日期的日期选择控件的Dom结构
         *
         * @private
         * @param {Date} showDate 日期框要显示的日期
         * @return {string} 给定日期的日期选择控件的Dom结构字符串
         */
        getCalendar: function (showDate) {
            this.setYearMonthDate(showDate);
            var emptyDays = this.getDayOfFirstDate(this.year, this.month);
            var daysOfMonth = this.getDaysOfMonth(this.year, this.month);
            var calendarDom = ''
                + CALENDAR_HEADER
                + '<li class="date-month">' + (this.month + 1) + '月</li>'
                + '<li class="date-year">' + this.year + '年</li>'
                + CALENDAR_DAY;
            for (var j = 0; j < emptyDays; j++) {
                calendarDom += '<li></li>';
            }
            for (var i = 1; i <= daysOfMonth; i++) {
                var dateData = 'data-date="' + this.year + '-' + (this.month + 1) + '-' + i + '"';
                if (i === this.day
                    && this.activeDate.getFullYear() === this.year
                    && this.activeDate.getMonth() === this.month
                    && this.activeDate.getDate() === this.day
                ) {
                    calendarDom += '<li class="date active" ' + dateData + '>' + i + '</li>';
                }
                else {
                    calendarDom += '<li class="date" ' + dateData + '>' + i + '</li>';
                }
            }
            calendarDom += CALENDAR_FOOTER;
            return calendarDom;
        },

        /**
         * 显示日期框
         *
         * @private
         */
        showCalendar: function () {
            var hasDateBox = this.dom.dateHolder.is(':visible');
            // 文本框中存在的数据
            var dataInInput = this.dom.targetInput.val();
            if (dataInInput.match(/^\d{1,4}-\d{1,2}-\d{1,2}$/)) {
                this.activeDate = getRealDate(dataInInput);
            }
            else {
                this.activeDate = new Date();
            }
            this.setYearMonthDate(this.activeDate);
            if (!hasDateBox) {
                $('.date-holder').hide();
                this.dom.dateHolder.html(this.getCalendar(this.activeDate)).show();
            }
        },

        /**
         * 事件绑定函数
         *
         * @private
         */
        blindEvent: function () {
            var pluginSelf = this;

            // 点击选择日期的文本框，显示日期控件
            this.dom.targetInput.on('focus', function (e) {
                pluginSelf.showCalendar();
                e.stopPropagation();
            });

            // 点击日期框内部元素，阻止冒泡，并进行相应操作
            this.dom.dateHolder.on('click', function (e) {
                e.stopPropagation();
                var clickTarget = $(e.target);
                var targetClass = $(e.target).attr('class');
                switch (targetClass) {

                    // 点击关闭，隐藏日期框
                    case 'date-close':
                        clickTarget.parents('.date-holder').hide();
                        break;

                    // 点击『今天』，选择当前日期
                    case 'date-today':
                        pluginSelf.activeDate = new Date();
                        var printDate = getShowDate(pluginSelf.activeDate);
                        clickTarget.parents('.date-holder').prev().val(printDate);
                        clickTarget.parents('.date-holder').html(pluginSelf.getCalendar(pluginSelf.activeDate));
                        break;

                    // 点击『清空』，清空日期数据
                    case 'date-clear':
                        clickTarget.parents('.date-holder').prev().val('');
                        $('.date').removeClass('active');
                        pluginSelf.activeDate = new Date();
                        break;

                    // 点击「<」日期框向前翻页
                    case 'date-pre':
                        pluginSelf.month--;
                        var preMonthDate = new Date(
                            pluginSelf.year,
                            pluginSelf.month,
                            pluginSelf.activeDate.getDate()
                        );
                        clickTarget.parents('.date-holder').html(pluginSelf.getCalendar(preMonthDate));
                        break;

                    // 点击「>」日期框向后翻页
                    case 'date-next':
                        pluginSelf.month++;
                        var nextMonthDate = new Date(
                            pluginSelf.year,
                            pluginSelf.month,
                            pluginSelf.activeDate.getDate()
                        );
                        clickTarget.parents('.date-holder').html(pluginSelf.getCalendar(nextMonthDate));
                        break;

                    // 点击日期选择时间
                    case 'date':
                        var pickedDate = clickTarget.attr('data-date');
                        pluginSelf.activeDate = getRealDate(pickedDate);
                        clickTarget.addClass('active').siblings().removeClass('active');
                        clickTarget.parents('.date-holder').prev().val(pickedDate);
                        break;
                }
            });

            // 点击文本框阻止冒泡
            this.dom.targetInput.on('click', function (e) {
                e.stopPropagation();
            });
        }
    };

    // 点击文本框和日期框以外的地方，日期框隐藏
    $(document).on('click', function () {
        $('.date-holder').hide();
    });

    /**
     * 给定Date型日期，获取显示日期
     *
     * @param {Date} realDate 给定日期
     * @return {string} 显示的日期
     */
    function getShowDate(realDate) {
        var yearToShow = realDate.getFullYear() + '';
        var monthToShow = realDate.getMonth() + 1 + '';
        var dateToShow = realDate.getDate() + '';
        return yearToShow + '-' + monthToShow + '-' + dateToShow;
    }

    /**
     * 给定显示日期，获取Date型日期
     *
     * @param {string} showDate 给定日期
     * @return {Date} Date型日期
     */
    function getRealDate(showDate) {
        var realYear = parseInt(showDate.split('-')[0], 10);
        var realMonth = parseInt(showDate.split('-')[1], 10) - 1;
        var realDay = parseInt(showDate.split('-')[2], 10);
        return new Date(realYear, realMonth, realDay);
    }

    /**
     * 定义插件名称
     *
     * @return {Object} 当前插件的实例
     */
    $.fn.datePicker = function () {
        return new DatePicker($(this));
    };
})(jQuery);
