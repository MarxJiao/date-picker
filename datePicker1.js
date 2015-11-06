/**
 * @file datePicker.js - a jQuery plugin to pick date
 * @author jiaojian04
 */
(function ($) {
    var activeDate = new Date();
    var year = activeDate.getFullYear();
    var month = activeDate.getMonth();
    var day = activeDate.getDate();

    /**
     * 获取给定年月的当月总天数
     *
     * @param {number} year 给定年份
     * @param {number} month 给定月份
     * @return {number} 当月天数
     */
    function getDaysOfMonth(year, month) {
        var daysOfFab = 28;
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
            daysOfFab = 29;
        }
        return [31, daysOfFab, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    /**
     * 获取给定年月当月第一天是星期几
     *
     * @param {number} year 给定年份
     * @param {number} month 给定月份
     * @return {number} 返回当月第一天是星期几：0 ~ 6
     */
    function getDayOfFirstDate(year, month) {
        var firstDate = new Date(year, month, 1);
        return firstDate.getDay();
    }

    /**
     * 设置日期框的位置
     *
     * @param {number} x 日期框对应文本框的offsetTop值
     * @param {number} y 日期框对应文本框的offsetLeft值
     */
    function getPosition(x, y) {
        var dateBoxY = $('.date-box').prev().outerHeight() + y;
        $('.date-box').css({top: dateBoxY, left: x});
    }

    /**
     * 返回给定日期的日期选择控件的Dom结构
     *
     * @param {Date} showDate 日期框要显示的日期
     * @return {string} 给定日期的日期选择控件的Dom结构字符串
     */
    function getCalendar(showDate) {
        if (!showDate) {
            var showDate = new Date();
        }

        year = showDate.getFullYear();
        month = showDate.getMonth();
        day = showDate.getDate();
        var emptyDays = getDayOfFirstDate(year, month);
        var daysOfMonth = getDaysOfMonth(year, month);
        var calendarDom = ''
            + '<div class="date-box">'
            +     '<div class="date-header">'
            +         '<ul>'
            +             '<li class="date-pre"><</li>'
            +             '<li class="date-month">' + (month + 1) + '月</li>'
            +             '<li class="date-year">' + year + '年</li>'
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
            if (i === day 
                && activeDate.getFullYear() === showDate.getFullYear()
                && activeDate.getMonth() === showDate.getMonth()
                && activeDate.getDate() === showDate.getDate()
            ) {
                calendarDom += '<li class="active" data-date="' + year + '-' + month + '-' + i + '">' + i + '</li>';
            }
            else {
                calendarDom += '<li data-date="' + year + '-' + month + '-' + i + '">' + i + '</li>';
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
    }

    /**
     * 点击关闭隐藏日期框
     */
    $(document).on('click', '.date-close', function () {
        $(this).parents('.date-box').hide();
    });

    /**
     * 点击日期选择时间
     */
    $(document).on('click', '.date-body li', function () {
        var pickedDate = $(this).attr('data-date');
        activeDate = new Date(pickedDate.split('-')[0], pickedDate.split('-')[1], pickedDate.split('-')[2]);
        $(this).addClass('active').siblings().removeClass('active');
        var monthToShow = parseInt(pickedDate.split('-')[1], 10) + 1 + '';
        var pickedDateShow = [pickedDate.split('-')[0], monthToShow, pickedDate.split('-')[2]].join('-');
        $(this).parents('.date-box').prev().val(pickedDateShow);
    });

    /**
     * 定义插件名称
     */
    $.fn.datePicker = function () {
        // this.after(getCalendar());
        var x = $(this).offset().top;
        var y = $(this).offset().left;
        $(this).on('focus', function () {
            var hasDateBox = $(this).siblings('.date-box').is(':visible');
            if (!hasDateBox) {
                $(this).siblings('.date-box').remove();
                $(this).after(getCalendar());
                getPosition(x, y);
            }
        });
        $(document).on('click', '.date-pre', function () {
            month--;
            var preMonthDate = new Date(year, month, day);
            $(this).parents('.date-box').prev().after(getCalendar(preMonthDate));
            getPosition(x, y);
            $(this).parents('.date-box').prev().siblings('.date-box').remove();
        });
        $(document).on('click', '.date-next', function () {
            month++;
            var nextMonthDate = new Date(year, month, day);
            $(this).parents('.date-box').prev().after(getCalendar(nextMonthDate));
            getPosition(x, y);
            $(this).parents('.date-box').prev().siblings('.date-box').remove();
        });
        $(document).on('click', '.date-today', function () {
            $(this).parents('.date-box').prev().after(getCalendar());
            getPosition(x, y);
            activeDate = new Date();
            year = activeDate.getFullYear();
            month = activeDate.getMonth();
            day = activeDate.getDate();
            var printDate = [year, (month + 1), day].join('-');
            $(this).parents('.date-box').siblings('input').val(printDate);
            $(this).parents('.date-box').prev().siblings('.date-box').remove();
        });
        $(document).on('click', '.date-clear', function () {
            $(this).parents('.date-box').siblings('input').val('');
            $(this).parents('.date-footer').siblings('.date-body').children().children().removeClass('active');
        });
        $(document).on('click', function () {
            $('.date-box').hide();
        });
        $(document).on('click', '.date-box', function (event) {
            event.stopPropagation();
        });
        $(this).on('click', function (event) {
            event.stopPropagation();
        });
    };
})(jQuery);
