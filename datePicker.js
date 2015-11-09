/**
 * @file datePicker.js - a simple jQuery plugin to pick date
 * @author jiaojian04
 *
 * Example：
 * HTML:
 * <input type="text" id="date" readonly>
 * JS:
 * $('#date').datePicker();
 */
(function ($) {
    function DatePicker(target) {
        this.target = target;
        this.activeDate = new Date();
        this.inputX = this.target.offset().top;
        this.inputY = this.target.offset().left;
        this.inputH = this.target.outerHeight();
        this.dateHolder = '<div class="date-holder"></div>';
        this.target.after(this.dateHolder);
        this.dateHolder = this.target.next();
        this.init();
    }
    DatePicker.prototype = {

        /**
         * 初始化时间插件
         */
        init: function () {
            this.getYearMonthDate(this.activeDate);
            this.getPosition();
            this.pickDate();
            this.clickInput();
            this.clickClose();
            this.clickToday();
            this.clickClear();
            this.clickPreMonth();
            this.clickNextMonth();
            this.stopClickPropagation();
        },

        /**
         * 设置日期框的位置
         *
         * @param {number} x 日期框对应文本框的offsetTop值
         * @param {number} y 日期框对应文本框的offsetLeft值
         */
        getPosition: function () {
            this.dateHolder.css({top: this.inputX + this.inputH, left: this.inputY});
            this.dateHolder.hide();
        },

        /**
         * 获取给定年月的当月总天数
         *
         * @param {number} year 给定年份
         * @param {number} month 给定月份
         * @return {number} 当月天数
         */
        getDaysOfMonth: function (year, month) {
            var daysOfFab = 28;
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                daysOfFab = 29;
            }
            return [31, daysOfFab, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        /**
         * 获取给日期的年月日
         *
         * @param {Date} sourseDate 给定日期
         */
        getYearMonthDate: function (sourseDate) {
            this.year = sourseDate.getFullYear();
            this.month = sourseDate.getMonth();
            this.day = sourseDate.getDate();
        },

        /**
         * 获取给定年月当月第一天是星期几
         *
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
         * @param {Date} showDate 日期框要显示的日期
         * @return {string} 给定日期的日期选择控件的Dom结构字符串
         */
        getCalendar: function (showDate) {
            this.getYearMonthDate(showDate);
            var emptyDays = this.getDayOfFirstDate(this.year, this.month);
            var daysOfMonth = this.getDaysOfMonth(this.year, this.month);
            var calendarDom = ''
                + '<div class="date-box">'
                +     '<div class="date-header">'
                +         '<ul>'
                +             '<li class="date-pre"><</li>'
                +             '<li class="date-month">' + (this.month + 1) + '月</li>'
                +             '<li class="date-year">' + this.year + '年</li>'
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
            for (var j = 0; j < emptyDays; j++) {
                calendarDom += '<li></li>';
            }
            for (var i = 1; i <= daysOfMonth; i++) {
                var dateData = 'data-date="' + this.year + '-' + (this.month + 1) + '-' + i + '"';
                if (i === this.day
                    && this.activeDate.getFullYear() === showDate.getFullYear()
                    && this.activeDate.getMonth() === showDate.getMonth()
                    && this.activeDate.getDate() === showDate.getDate()
                ) {
                    calendarDom += '<li class="active" ' + dateData + '>' + i + '</li>';
                }
                else {
                    calendarDom += '<li ' + dateData + '>' + i + '</li>';
                }
            }
            calendarDom += ''
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
            return calendarDom;
        },

        /**
         * 显示日期框
         */
        showCalendar: function () {
            var hasDateBox = this.dateHolder.is(':visible');
            // 文本框中存在的数据
            var dataInInput = this.target.val();
            if (dataInInput.match(/^\d{1,4}-\d{1,2}-\d{1,2}$/)) {
                this.activeDate = this.getRealDate(dataInInput);
            }
            else {
                this.activeDate = new Date();
            }
            this.getYearMonthDate(this.activeDate);
            if (!hasDateBox) {
                $('.date-holder').hide();
                this.dateHolder.html(this.getCalendar(this.activeDate)).show();
            }
        },

        /**
         * 显示日期框
         */
        clickInput: function () {
            var pluginSelf = this;
            this.target.on('focus', function () {
                pluginSelf.showCalendar();
            });
        },

        /**
         * 点击关闭隐藏日期框
         */
        clickClose: function () {
            $(document).on('click', '.date-close', function () {
                $(this).parents('.date-holder').hide();
            });
        },

        /**
         * 点击『今天』，选择当前日期
         */
        clickToday: function () {
            var pluginSelf = this;
            $(document).on('click', '.date-today', function () {
                pluginSelf.activeDate = new Date();
                var printDate = pluginSelf.getShowDate(pluginSelf.activeDate);
                $(this).parents('.date-holder').prev().val(printDate);
                $(this).parents('.date-holder').html(pluginSelf.getCalendar(pluginSelf.activeDate));
            });
        },

        /**
         * 点击『清空』，清空日期数据
         */
        clickClear: function () {
            var pluginSelf = this;
            $(document).on('click', '.date-clear', function () {
                $(this).parents('.date-holder').prev().val('');
                $(this).parents('.date-footer').siblings('.date-body').children().children().removeClass('active');
                pluginSelf.activeDate = new Date();
            });
        },

        /**
         * 点击日期选择时间
         */
        pickDate: function () {
            var pluginSelf = this;
            $(document).on('click', '.date-body li', function () {
                var pickedDate = $(this).attr('data-date');
                pluginSelf.activeDate = pluginSelf.getRealDate(pickedDate);
                $(this).addClass('active').siblings().removeClass('active');
                $(this).parents('.date-holder').prev().val(pickedDate);
            });
        },

        /**
         * 点击「<」日期框向前翻页
         */
        clickPreMonth: function () {
            var pluginSelf = this;
            $(document).on('click', '.date-pre', function () {
                pluginSelf.month--;
                var preMonthDate = new Date(pluginSelf.year, pluginSelf.month, pluginSelf.activeDate.getDate());
                $(this).parents('.date-holder').html(pluginSelf.getCalendar(preMonthDate));
            });
        },

        /**
         * 点击「>」日期框向后翻页
         */
        clickNextMonth: function () {
            var pluginSelf = this;
            $(document).on('click', '.date-next', function () {
                pluginSelf.month++;
                var nextMonthDate = new Date(pluginSelf.year, pluginSelf.month, pluginSelf.activeDate.getDate());
                $(this).parents('.date-holder').html(pluginSelf.getCalendar(nextMonthDate));
            });
        },

        /**
         * 点击日期框以外的地方关闭日期框，点击内部和文本框阻止冒泡
         */
        stopClickPropagation: function () {
            $(document).on('click', function () {
                $('.date-holder').hide();
            });
            $(document).on('click', '.date-holder', function (event) {
                event.stopPropagation();
            });
            this.target.on('click', function (event) {
                event.stopPropagation();
            });
        },

        /**
         * 给定Date型日期，获取显示日期
         *
         * @param {Date} realDate 给定日期
         * @return {string} 显示的日期
         */
        getShowDate: function (realDate) {
            var yearToShow = realDate.getFullYear() + '';
            var monthToShow = realDate.getMonth() + 1 + '';
            var dateToShow = realDate.getDate() + '';
            return yearToShow + '-' + monthToShow + '-' + dateToShow;
        },

        /**
         * 给定显示日期，获取Date型日期
         *
         * @param {string} showDate 给定日期
         * @return {Date} Date型日期
         */
        getRealDate: function (showDate) {
            var realYear = parseInt(showDate.split('-')[0], 10);
            var realMonth = parseInt(showDate.split('-')[1], 10) - 1;
            var realDay = parseInt(showDate.split('-')[2], 10);
            return new Date(realYear, realMonth, realDay);
        }
    };

    /**
     * 定义插件名称
     *
     * @return {Object} 当前插件的实例
     */
    $.fn.datePicker = function () {
        return new DatePicker($(this));
    };
})(jQuery);
