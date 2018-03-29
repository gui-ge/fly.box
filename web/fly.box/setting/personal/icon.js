/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly
    $.box.UserIconSetting = $.Class({
        name: '头像',
        title: '头像设置',
        needUpload: true,
        base: $.box.FormBase,
        saveUrl: $.base.ajaxUrl('personal', 'SetIcon'),
        buttons: ['save'],
        ajaxOption: {
            dataType:'json'
        },
        saveSuccess: function (result) {
            result.msg && alert(result.msg);
            if (result.success) {
                $('#icon-preview').css("background-image", "url(" + $.appendQuery('r',Math.random(),result.data.icon) + ")");
                $.alertAuto('保存成功，你需要按F5刷新页面才能看到效果。');
            }
        },
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            $.post($.box.ajaxUrl('Personal', 'GetIcon'), function (result) {
                $('#icon-preview').css("background-image", "url(" + result.data.icon + ")");
            })
        }
    });

    $.Style.loadCss('../themes/box-default/setting.css?'+$.pathPart);
    window.page = new $.box.UserIconSetting()
    page.show();
} ()