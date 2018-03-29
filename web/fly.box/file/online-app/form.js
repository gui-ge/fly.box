/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    $.loadScript("common-box.js?" + $.pathPart);
    var _top = $.myTop()

    fly.box.OnlineApp = $.Class({
        name: '网页应用',
        base: $.box.FormBase,
        service: 'OnlineApp',
        buttons: ['<a onclick="page.preview()">预览</a>', 'save', 'cancel'],
        getBaseParams: function () {
            return 'parentId=' + $.getQuery('parentId')
        },
        onGetModel: function (res) {
            var data = $.JSON.decode(res.data.content);
            data.name = res.data.name
            res.data = data;
        },
        onAfterCreateForm: function () {
            if (this.isAdd)
                this.form[0].url.value = "http://";
            else {
                $(this.form[0].openType).where("o=>o.checked")[0].click();
            }
        },
        preview: function () {
            $.checkArtDialog();
            try {
                _top.artDialog.defaults.zIndex = 100000
            } catch (e) { }

            var app = this.form.vals();
            if (app.openType == "new-page") {
                window.open(app.url, "_blank");
                return
            }

            app.width = parseInt(app.width);
            app.height = parseInt(app.height);
            var d = openApp(app);
        }
    });

    fly.box.OnlineApp.prototype.saveSuccess = fly.box.OnlineApp.prototype.saveSuccess.before(function (res) {
        if (res.success) {
            if (res.data.appended)
                $.common.showMessage('已添加到桌面。')
            if ((res.data.appended || res.data.edited) && top.desktop) {
                try {
                    top.desktop.loadUserData()
                } catch (E) { }
            }
        }
    })


    window.page = $.base.createPage("fly.box.OnlineApp")
    page.show();


//    if (!top.art && top.$) {
//        _top.$.loadScript("../../fly.common/artDialog/artDialog.source.js?" + $.pathPart, function () {
//            _top.$.loadScript("../../fly.common/artDialog/plugins/iframeTools.source.js");
//        })
//        _top.$.Style.loadCss('../../fly.common/artDialog/skins/twitter.css');
//    }
} ()