/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.base.RoleForm = $.Class({
        name:'用户组',
        base: $.base.FormBase
    });

    window.page = new fly.base.RoleForm()
    page.show();
} ()