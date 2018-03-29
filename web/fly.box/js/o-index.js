/// <reference path="../common/common.js" />
!function () {
    var $ = fly;
    window.indexPath = '';
    fly.box.fixParam = '$with-org=1'
    $.box.isWithOrg = true;

    fly.box.OrgIndex = $.Class({
        base: fly.box.IndexBase,
        init: function (data) {
            this.loginInfo = data
            this.showSpaceSize()
            this.reBuildFolderMenus()

            $('#user-name').html('<a id=a-org-name >{0}</a><a id=a-user-name class=to-mybox href=u-index.htm title="转到我的个人空间\n（属于我个人独有的，他人不能访问）">{1}</a>'.format(data.org.name, data.user.name));

            if (data.user.isManager) {
                $.doc.addClass('is-admin')
            }
            else {
                var btnSetting = $('#btn-setting');
                btnSetting.attr('href', btnSetting.attr('href').replace('$with-org=1', ''));
            }

            if (data.logo) {
                $('#org-logo').attr('src', data.logo);
            }

            document.title = data.org.name + '●' + document.title;
            
            if (data.openUserSpace===false)
                $.doc.addClass('no-user-space')

            if (data.isFirst)
                $.loadScript("js/first.js?" + $.pathPart)
            this.checkVersion();
        },
        checkVersion: function () {
            if (this.loginInfo.user.isManager)
                $.loadScript('http://flyui.net/fly.box/version/?cmd=client-index-check&v=' + $.pathPart + '&' + new Date().format($.box.dFormat));
        },
        createMembers: function () {
            this.searchBox = new $.ui.EmptyBox("#search");
            this.searchForm = $('#search-form');
            this.contentFrame = $('#content-frame');
            this.folderMenus = $('#folder-menus')
            this.topMsgBox = $('#top-msg-box');
        },
        reBuildFolderMenus: function () {
            var menus = this.loginInfo.folderMenus = this.loginInfo.folderMenus || []
            var format = '{@for o as menu}<li><a href="file/manage.htm?{0}&path={menu.id}" target=f >{menu.name}</a></li>{for@}'
            var ms = function (m) {
                menus[m.id] = m;
            }

            var htmls = []
            if (menus.org) {
                htmls.push(format.format('$with-org=1', menus.org));
                menus.org.each(ms);
            }

            if (menus.orgMy) {
                htmls.push(format.format('$with-org=1', menus.orgMy));
                menus.orgMy.each(ms);
            }

            if (htmls.length) {
                this.folderMenus.html(htmls.join('<li class=split ></li>'));
                if (this.loginInfo.user.isManager || (menus.orgMy && menus.orgMy.length)) {
                    this.folderMenus.append('<li class=manage-folder-menu ><a class=submit-button target=f href="common/form.htm?m=setting&form=folder-menu">排序</a></li>');
                }
            }
            else {
                this.folderMenus.html('')
            }
        }
    });

    window.indexPage = $.box.createPage(function () {
        return new fly.box.OrgIndex();
    })
} ()

