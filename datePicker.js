/**
 * @file datePicker.js - a jQuery plugin to pick date
 * @author jiaojian04
 */
(function ($) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    function getDaysOfMonth(year, month) {
        var daysOfFab = 28;
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
            daysOfFab = 29;
        }
        return [31, daysOfFab, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }
    function getDayOfFirstDate(year, month) {
        var date = new Date(year, month, 1);
        return date.getDay();
    }
    function getCalendar(ifActiveToDay, showDate) {
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
            if (i === day && ifActiveToDay) {
                calendarDom += '<li class="active">' + i + '</li>';
            }
            else {
                calendarDom += '<li>' + i + '</li>';
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
    $(document).on('click', '.date-close', function () {
        $(this).parents('.date-box').hide();
    });
    $(document).on('click', '.date-body li', function () {
        day = $(this).html();
        var printDate = [year, (month + 1), day].join('-');
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parents('.date-box').prev().val(printDate);
    });
    $.fn.datePicker = function () {
        // this.after(getCalendar());
        $(this).on('focus', function () {
            var hasDateBox = $(this).siblings('.date-box').is(':visible');
            if (!hasDateBox) {
                $(this).siblings('.date-box').remove();
                $(this).after(getCalendar(true));
            }
        });
        $(document).on('click', '.date-pre', function () {
            month--;
            var preMonthDate = new Date(year, month, day);
            $(this).parents('.date-box').prev().after(getCalendar(false, preMonthDate));
            $(this).parents('.date-box').prev().siblings('.date-box').remove();
        });
        $(document).on('click', '.date-next', function () {
            month++;
            var nextMonthDate = new Date(year, month, day);
            $(this).parents('.date-box').prev().after(getCalendar(false, nextMonthDate));
            $(this).parents('.date-box').prev().siblings('.date-box').remove();
        });
        $(document).on('click', '.date-today', function () {
            $(this).parents('.date-box').prev().after(getCalendar(true));
            date = new Date();
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
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
