/**
 * @file datePicker.js - a jQuery plugin to pick date
 * @author jiaojian04
 */
(function ($) {
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

    function getCalendar(showDate) {
        if (!showDate) {
            var showDate = new Date();
        }
        var year = showDate.getFullYear();
        var month = showDate.getMonth();
        var date = showDate.getDate();
        var emptyDays = getDayOfFirstDate(year, month);
        var daysOfMonth = getDaysOfMonth(year, month);
        console.log(year);

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
            if (i === date) {
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
    $.fn.datePicker = function () {
        this.after(getCalendar());
    }
})(jQuery);
