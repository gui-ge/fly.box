/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly
    $.box.UserSignSetting = $.Class({
        name: '签名',
        title: '签名设置',
        isAdd: true,
        base: $.box.FormBase,
        saveUrl: $.base.ajaxUrl('personal', 'SetSign'),
        buttons: ['save'],
        saveSuccess: function (result) {
            result.msg && alert(result.msg);
            if (result.success) {
                $.alertAuto('保存成功');
            }
        },
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            $.post($.box.ajaxUrl('Personal', 'GetSign'), function (result) {
                $('#txtSign').val(result.data.sign);
            })
        }
    });

    $.Style.loadCss('../themes/box-default/setting.css?'+$.pathPart);
    window.page = new $.box.UserSignSetting()
    page.show();
} ()