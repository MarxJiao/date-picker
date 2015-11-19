/**
 * @file 日期选择插件单元测试
 * @author jiaojiano4
 */
describe('日期选择控件', function () {
    var objDateTest = $('#date1').datePicker();
    var testDate = new Date(2015, 10, 9);

    it('检测控件是否存在', function () {
        expect($('.date-holder')).toExist();
    });

    it('控件放置到正确的位置', function () {
        expect($('.date-holder').css('top')).toEqual('19px');
        expect($('.date-holder').css('left')).toEqual('0px');
    });

    it('getDaysOfMonth', function () {
        expect(objDateTest.getDaysOfMonth(2015, 1)).toEqual(28);
    });

    it('setYearMonthDate', function () {
        objDateTest.setYearMonthDate(testDate);
        expect(objDateTest.year).toEqual(2015);
        expect(objDateTest.month).toEqual(10);
        expect(objDateTest.day).toEqual(9);
    });

    it('getDayOfFirstDate', function () {
        expect(objDateTest.getDayOfFirstDate(2015, 10)).toEqual(0);
    });

    it('getCalendar', function () {
        objDateTest.activeDate = testDate;
        var calendarDom = objDateTest.getCalendar(testDate);
        expect($(calendarDom)).toContainElement('li.active');
    });

    it('clickInput and showCalendar', function () {
        $('#date1').focus();
        expect($('.date-holder')).toContainElement('div.date-box');
        expect($('.date-box')[0]).toBeVisible();
    });

    it('clickClose', function () {
        $('#date1').click();
        $('.date-close').click();
        expect($('.date-box')[0]).not.toBeVisible();
    });

    it('clickToday', function () {
        $('#date1').click();
        $('.date-today').click();
        var today = new Date();
        expect(objDateTest.activeDate.getFullYear()).toEqual(today.getFullYear());
        expect(objDateTest.activeDate.getMonth()).toEqual(today.getMonth());
        expect(objDateTest.activeDate.getDate()).toEqual(today.getDate());
    });

    it('clickClear', function () {
        $('#date1').click();
        $('.date-today').click();
        $('.date-clear').click();
        expect($('#date1').val()).toEqual('');
    });

    it('pickDate', function () {
        $('#date1').click();
        $('.active').click();
        var today = new Date();
        expect(objDateTest.activeDate.getFullYear()).toEqual(today.getFullYear());
        expect(objDateTest.activeDate.getMonth()).toEqual(today.getMonth());
        expect(objDateTest.activeDate.getDate()).toEqual(today.getDate());
    });

    it('clickPreMonth', function () {
        objDateTest.activeDate = testDate;
        objDateTest.showCalendar();
        $('.date-pre').click();
        expect(objDateTest.month).toEqual(testDate.getMonth() - 1);
    });

    it('clickNextMonth', function () {
        objDateTest.activeDate = testDate;
        objDateTest.showCalendar();
        $('.date-next').click();
        expect(objDateTest.month).toEqual(testDate.getMonth() + 1);
    });

    it('stopClickPropagation,click document', function () {
        objDateTest.activeDate = testDate;
        objDateTest.showCalendar();
        $(document).click();
        expect($('.date-box')[0]).not.toBeVisible();
    });

    it('stopClickPropagation,click date box', function () {
        objDateTest.activeDate = testDate;
        objDateTest.showCalendar();
        $('.date-box').click();
        expect($('.date-box')[0]).toBeVisible();
    });

    afterEach(function () {
        $('.date-close').click();
    });
});
