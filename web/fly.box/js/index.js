/// <reference path="../common/common.js" />

!function () {
    var $ = fly;
    window.indexPath = '';
    fly.box.Index = $.Class({
        base: fly.box.IndexBase,
        init: function (data) {
            this.loginInfo = data
            this.showSpaceSize()
            this.reBuildFolderMenus()

            $('#user-name').html('{0}-{1}'.format(data.user.name, data.user.login));
            //$('#org-menu li').append(' &nbsp;●<a id=org-disk-manage href="index.htm">主页</a>')
            $('#user-ico img').attr('src',data.user.icon);
            //            if (data.user.isManager) {
            //                
            //            }

            if (data.logo) {
                $('#org-logo').attr('src', data.logo);
            }

            document.title = data.user.name + '●' + document.title;

            if (data.isFirst)
                $.loadScript("js/first.js?" + $.pathPart)
        },
        createMembers: function () {
            this.searchBox = new $.ui.EmptyBox("#search");
            this.searchForm = $('#search-form');
            this.contentFrame = $('#content-frame');
            this.folderMenus = $('#folder-menus')
            //this.orgFolderMenus = $('#org-folder-menus');
            this.topMsgBox = $('#top-msg-box');
        },
        reBuildFolderMenus: function () {
            var menus = this.loginInfo.folderMenus = this.loginInfo.folderMenus || []
            var format = '{@for o as menu}<li><a href="file/manage.htm?{0}&path={menu.id}" target=f >{menu.name}</a></li>{for@}'
            var ms = function (m) {
                menus[m.id] = m;
            }

            if (menus.user) {
                menus.user.each(ms);
                this.folderMenus.html(format.format('', menus.user));
            }

            //在个人主页暂时不显示
//            var htmls = []
//            if (menus.org) {
//                htmls.push(format.format('$with-org=1', menus.org));
//                menus.org.each(ms);
//            }
//            if (menus.orgMy) {
//                htmls.push(format.format('$with-org=1', menus.orgMy));
//                menus.orgMy.each(ms);
//            }
//            htmls.length && this.orgFolderMenus.html(htmls.join('<li class=split ></li>'));
        }
    });


    window.indexPage = $.box.createPage(function () {
        return new fly.box.Index();
    })
} ()

