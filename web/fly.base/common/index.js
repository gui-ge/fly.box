/// <reference path="common.js" />
!function () {
    var $ = fly;
    fly.base.Index = $.Class({
        constructor: function () {
            this.createMembers();
            this.bindEvents();
            this.getLoginInfo();
        },
        loginInfo: { folderMenus: {} },
        getLoginInfo: function () {
            $.base.getUserContext(function () {
                index.init(window.userContext);
            });
        },
        init: function (data) {
            this.loginInfo = data
            //            this.reBuildFolderMenus()
            //            if(data.isFirst)
            //                $.loadScript('js/first.js')
        },
//        reBuildFolderMenus: function () {
//            var menus = this.loginInfo.folderMenus = this.loginInfo.folderMenus || []
//            menus.each(function (m) {
//                menus[m.id] = m;
//            })
//            var html = '{@for o as menu}<li><a href="file/manage.htm?path={menu.id}" target=f >{menu.name}</a></li>{for@}'.format(menus);
//            this.folderMenus.html(html);
//        },
        createMembers: function () {
            this.searchBox = new $.ui.EmptyBox("#search");
            this.searchForm = $('#search-form');
            this.contentFrame = $('#content-frame');
            //this.folderMenus = $('#folder-menus')
        },
        bindEvents: function () {
            var me = this;
            this.searchForm.submit(function () {
                search(me.searchBox.value());
                return false;
            });
        }
    });

    window.index = new fly.base.Index();
    window.search = function (key) {
        try {
            index.contentFrame[0].contentWindow.search(key);
        } catch (e) { }
    }
} ()

