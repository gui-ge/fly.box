/// <reference path="../common/form-base.js" />
!function () {
    var $ = fly
    $.box.OtherSetting = $.Class({
        name: '其它',
        title: '常规设置',
        needUpload: true,
        isAdd: false,
        base: $.box.FormBase,
        pageFormat: [parent.isSettingPage ? '' : '<div id=top-empty></div><div id="title-block">{title}</div>',
                    '<div id=other-links ><a id="file-stat" href="../../fly.box/common/form.htm?m=setting&form=app-setting&$with-org=1">APP设置</a>  <a id="file-stat" target="f" href="../../fly.box/log/stat/index.htm">文件统计</a> <a id="log-menu" target="f" href="../common/list.htm?m=log/log">操作日志</a>  <a id="log-menu" target="f" href="../common/form.htm?m=setting&form=sms?by=sys">单位短信帐号</a> </div>',
                    '<div id="toolbar" class=button-32  ></div>',
                    '<form id="content-block" method="post"></form>'
                    ].join(''),
        buttons: ['save'],
        getModelUrl: $.box.ajaxUrl('setting', 'settingInit'),
        saveSuccess: function () {
            $.alertAuto('保存成功，你可能需要重新登录。');
        },
        createShareResourceInRoot: function () {
            $.post($.box.ajaxUrl('setting', 'createShareResourceInRoot'), function (res) {
                if (res.success) { 
                    alert('“常用软件”文件夹已创建。')
                }
            })
        }
        //        ,
        //        createForm: function () {
        //            this.$base.createForm.apply(this, arguments);
        ////            $.post($.box.ajaxUrl('setting', 'settingInit'), function (result) {
        ////                page.model = result.data
        ////                page.initFields()
        ////            })
        //        }
    });

    $.doc.addClass('setting-other');
    $.Style.loadCss('../themes/box-default/setting.css?' + $.pathPart);
    window.page = new $.box.OtherSetting()
    page.show();
} ()