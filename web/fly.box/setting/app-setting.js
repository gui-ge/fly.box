/// <reference path="../common/form-base.js" />
!function () {
    var $ = fly
    $.box.AppSetting = $.Class({
        name: 'App设置',
        title: 'App设置',
        needUpload: true,
        isAdd: false,
        base: $.box.FormBase,
        pageFormat: [parent.isSettingPage ? '' : '<div id=top-empty></div><div id="title-block">{title}</div>',
                    '<div id="toolbar" class=button-32  ></div>',
                    '<form id="content-block" method="post"></form>'
                    ].join(''),
        buttons: ['save'],
        getModelUrl: $.box.ajaxUrl('setting', 'GetAppSetting'),
        saveUrl: fly.box.ajaxUrl('setting', 'SaveAppSetting'),
        saveSuccess: function (res) {
            res = $.JSON.decode(res);
            if (!res.success)
                alert(res.msg || '保存出错');

            if (res.data.sendToPlatform) {
                $.alertAuto('保存成功，请尝试手机APP自动绑定服务器地址功能。');
            }
            else {
                var postData = res.data.postData
                var url = res.data.url

                var h = setTimeout(function () {
                    alert('请确认你的服务器能访问：' + url)
                }, 2000);

                window._jsonp = function (res2) {
                    if (res2.success) {
                        clearTimeout(h);
                        $.alertAuto('保存成功，请尝试手机APP自动绑定服务器地址功能。');
                    }
                    else if (res.msg) {
                        alert(res.msg)
                    }
                }
                $.loadScript($.appendQuery("jsonp", "_jsonp", url) + "&" + postData);
            }
        }
    });
    $.Style.loadCss('../themes/box-default/setting.css?' + $.pathPart);
    window.page = new $.box.AppSetting()
    window.page.show()
} ()