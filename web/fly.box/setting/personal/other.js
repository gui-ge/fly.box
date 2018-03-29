/// <reference path="../../common/form-base.js" />
!function ($) {
    var $ = fly
    $.box.OtherSetting = $.Class({
        name: '设置',
        title: '其他设置',
        //isAdd: false,
        base: $.box.FormBase,
        //getModelUrl: $.base.ajaxUrl('personal', 'GetOther'),
        //saveUrl: $.base.ajaxUrl('personal', 'SaveOther'),
        buttons: [],
        createShareResourceInRoot: function () {
            $.post($.box.ajaxUrl('personal', 'createShareResourceInRoot'), function (res) {
                if (res.success) {
                    alert('“常用软件”文件夹已创建。')
                }
            })
        }
    });

    $.Style.loadCss('../themes/box-default/setting.css?' + $.pathPart);
    window.page = new $.box.OtherSetting()
    page.show();
} ()