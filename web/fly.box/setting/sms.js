/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly, by = $.getQuery('by');
    $.box.SmsKeySetting = $.Class({
        name: by == 'sys' ? '单位短信账户绑定' : '个人短信账户绑定',
        name: by == 'sys' ? '单位短信账户绑定' : '个人短信账户绑定',
        isAdd: false,
        base: $.box.FormBase,
        getModelUrl: $.box.ajaxUrl('sms', 'GetSMSKeyModel', 'by=' + by),
        saveUrl: $.base.ajaxUrl('sms', 'SetSMSKey', 'by=' + by),
        buttons: ['save'],
        saveSuccess: function (result) {
            result.msg && alert(result.msg);
            if (result.success) {
                window.location.href += ' ';
            }
        },
        unBind: function () {
            $.post(this.saveUrl, { "new-key": "" }, this.saveSuccess);
        }
    });

    $.Style.loadCss('../themes/box-default/setting.css?' + $.pathPart);
    window.page = new $.box.SmsKeySetting()
    page.show();
} ()