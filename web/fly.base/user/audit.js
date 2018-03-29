/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly
    $.base.Account = $.Class({
        name: '帐号',
        title: '帐号审核',
        base: $.base.FormBase,
        getModelUrl: $.base.ajaxUrl('User', 'GetAudit'),
        saveUrl: $.base.ajaxUrl('User', 'Audit'),
        onGetModel: function (res) {
            $.extend(res.data, res.data.user, res.data.log);
            setTimeout(function () {
                if (res.data.Status != 16) {//16待审核状态
                    $('#wait-audit,#wait-audit-label').disable();
                }
                $('#user-info').html('{LoginName}（{NickName}）'.format(res.data));

                if (res.data.log) {
                    $('#audit-log').html('{AuditUser} 于 {0} 审核'.format(res.data.AuditTime.format($.base.dt2Format), res.data));
                    $('#audit-log-block').show();
                }

            }, 100);
        }
    });

    window.page = new $.base.Account()
    page.show();
} ()