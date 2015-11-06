/**
 * @file datePicker.js - a jQuery plugin to pick date
 * @author jiaojian04
 */
(function ($) {
    function DatePicker(target) {
        this.target = target;
        this.activeDate = new Date();
        this.year = this.activeDate.getFullYear();
        this.month = this.activeDate.getMonth();
        this.day = this.activeDate.getDate();
        this.inputX = this.target.offset().top;
        this.inputY = this.target.offset().left;
        this.inputH = this.target.outerHeight();
        this.dateHolder = '<div class="date-holder"></div>';
        this.init();
    }
    DatePicker.prototype = {

        /**
         * 初始化时间插件
         */
        init: function () {
            var _self = this;
            console.log(_self.getCalendar);
            this.getPosition();
            this.target.on('focus', function (_self) {
                var hasDateBox = $(this).next('.date-holder').is(':visible');
                if (!hasDateBox) {
                    $(this).next('.date-holder').html(_self.getCalendar(_self.activeDate)).show();
                }
            });
        },

        /**
         * 设置日期框的位置
         *
         * @param {number} x 日期框对应文本框的offsetTop值
         * @param {number} y 日期框对应文本框的offsetLeft值
         */
        getPosition: function () {
            this.target.after(this.dateHolder);
            this.target.next('.date-holder').css({top: this.inputX + this.inputH, left: this.inputY});
            this.target.next('.date-holder').hide;
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
            this.year = showDate.getFullYear();
            this.month = showDate.getMonth();
            this.day = showDate.getDate();
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
            for (var i = 0; i < emptyDays; i++) {
                calendarDom += '<li></li>';
            }
            for (var i = 1; i <= daysOfMonth; i++) {
                if (i === this.day
                    && this.activeDate.getFullYear() === showDate.getFullYear()
                    && this.activeDate.getMonth() === showDate.getMonth()
                    && this.activeDate.getDate() === showDate.getDate()
                ) {
                    calendarDom += '<li class="active" data-date="' + this.year + '-' + this.month + '-' + i + '">' + i + '</li>';
                }
                else {
                    calendarDom += '<li data-date="' + this.year + '-' + this.month + '-' + i + '">' + i + '</li>';
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
         * 点击关闭隐藏日期框
         */
        clickClose: function () {
            $(document).on('click', '.date-close', function () {
                $(this).parents('.date-box').hide();
            });
        },

        /**
         * 点击『今天』，选择当前日期
         */
        clickToday: function () {
            $(document).on('click', '.date-today', function () {
                this.activeDate = new Date();
                this.year = this.activeDate.getFullYear();
                this.month = this.activeDate.getMonth();
                this.day = this.activeDate.getDate();
                var printDate = [this.year, (this.month + 1), this.day].join('-');
                $(this).parents('.date-holder').prev().val(printDate);
                $(this).parents('.date-holder').html(this.getCalendar(this.activeDate));
            });
        },

        /**
         * 点击『清空』，清空日期数据
         */
        clickClear: function () {
            $(document).on('click', '.date-clear', function () {
                $(this).parents('.date-holder').prev().val('');
                $(this).parents('.date-footer').siblings('.date-body').children().children().removeClass('active');
                this.activeDate = new Date();
            });
        },

        /**
         * 点击日期选择时间
         */
        pickDate: function () {
            $(document).on('click', '.date-body li', function () {
                var pickedDate = $(this).attr('data-date');
                this.activeDate = new Date(pickedDate.split('-')[0], pickedDate.split('-')[1], pickedDate.split('-')[2]);
                $(this).addClass('active').siblings().removeClass('active');
                var monthToShow = parseInt(pickedDate.split('-')[1], 10) + 1 + '';
                var pickedDateShow = [pickedDate.split('-')[0], monthToShow, pickedDate.split('-')[2]].join('-');
                $(this).parents('.date-holder').prev().val(pickedDateShow);
            });
        },

        /**
         * 点击「<」日期框向前翻页
         */
        clickPreMonth: function () {
            $(document).on('click', '.date-pre', function () {
                this.month--;
                var preMonthDate = new Date(this.year, this.month, this.activeDate.getDate());
                $(this).parents('.date-holder').html(this.getCalendar(preMonthDate));
            });
        },

        /**
         * 点击「>」日期框向后翻页
         */
        clickNextMonth: function () {
            $(document).on('click', '.date-next', function () {
                this.month++;
                var nextMonthDate = new Date(this.year, this.month, this.activeDate.getDate());
                $(this).parents('.date-holder').html(this.getCalendar(nextMonthDate));
            });
        },

        /**
         * 点击日期框以外的地方关闭日期框，点击内部和文本框阻止冒泡
         */
        stopClickPropagation: function () {
            $(document).on('click', function () {
                $('.date-holder').hide();
            });
            $(document).on('click', this.target, function (event) {
                event.stopPropagation();
            });
            this.target.on('click', function (event) {
                event.stopPropagation();
            });
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
