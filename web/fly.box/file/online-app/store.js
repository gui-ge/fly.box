/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.box.Store = $.Class({
        name: '网页应用',
        buttons: [],
        isAdd: false,
        base: $.box.FormBase,
        service: 'OnlineApp',
        getModelUrl: $.box.ajaxUrl('OnlineApp', 'GetStoreInitInfo'),
        getBaseParams: function () {
            return 'parentId=' + $.getQuery('parentId')
        },
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            var url = '../file/manage.htm?$plugins=online-app/store-manage-plugin.js&path=' + this.model.myDesktopDirId;
            $('#btn-my-desktop').attr('href', url);
            $('#btn-org-apps').attr('href', '../file/manage.htm?$plugins=online-app/store-manage-plugin.js&$with-org=1&path=' + this.model.orgOnlineAppsDirId);
            this.navBar = new $.ui.NavBar({ el: '#nav-bar' })
            $('#frame-wrap iframe').attr('src', url);
            this.navBar.selectItem($('#btn-my-desktop').parent()[0]);
            $('#btn-add-app').click(function () {
                $('#frame-wrap iframe')[0].contentWindow.manager.addApp()
                $.Event.stop(true);
                return false;
            });
        }
    });
    $.Style.loadCss('../themes/box-default/file/app-store.css?' + $.pathPart);
    $.Style.loadCss("../../fly.common/fly.ui/simple/default.css?" + $.pathPart);
    $.loadScript("../../fly.common/fly.ui/simple/fly-css-ui.js?" + $.pathPart, function () {
        window.page = $.base.createPage("fly.box.Store")
        page.show();
    });
} ()