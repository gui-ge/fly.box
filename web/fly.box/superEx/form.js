/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.base.SuperExForm = $.Class({
        name: '超级扩展',
        base: $.base.FormBase
    });
    window.page = new fly.base.SuperExForm()
    page.show();
} ()