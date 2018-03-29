/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly, by = $.getQuery('by');
    $.box.FolderMenuManage = $.Class({
        name: '文件夹菜单管理',
        isAdd: true,
        base: $.box.FormBase,
        getModelUrl: $.box.ajaxUrl('folder', 'GetFixToMenuForManage'),
        buttons: [],
        menuFormat: '<li id="{id}"><a title=前移 onclick=page.move(this,-1) >▲</a> <a title=后移 onclick=page.move(this,1) >▼</a> <a class=remove title=从菜单移除 onclick=page.remove(this) >X</a> <label>{name}</label></li>',
        onAfterCreateForm: function () {
            this.defLoading = { box: $('#menus')[0], css: 'f-loading' }
            this.reloadMenus();            
        },
        reloadMenus: function () {
            $.post(this.getModelUrl, function (res) {
                page.model = res.data
                var folders = res.data.org || res.data.orgMy
                var html = folders.select(function (f) {
                    return page.menuFormat.format(f);
                }).join('');
                $('#menus').html(html)
            }).setLoading(this.defLoading);
        },
        move: function (btn, pos) {
            var index = 0
            var menus = $('#menus').$('li').select(function () {
                return { id: this.id, pos: index++ }
            });
            var theId = btn.parentNode.id;
            var theMenu = menus.first('o=>o.id=="{0}"'.format(theId));
            var nearMenu = menus.first('o=>o.pos==' + (theMenu.pos + pos));
            if (!nearMenu)
                return;
            nearMenu.pos -= pos;
            theMenu.pos += pos;
            var sorts = menus.select('o=>o.id+":"+o.pos').join('|');

            $.post($.box.ajaxUrl('folder', 'MoveFolderMenu'), { menuType: this.model.org ? 'org' : 'orgMy', menuSorts: sorts }, function (res) {
                res.msg && alert(res.msg);
                if (res.success) {
                    page.reloadMenus();
                }
            }).setLoading(this.defLoading);
        },
        remove: function (btn) {
            $.post($.box.ajaxUrl('folder', 'RemoveFolderMenu'), { menuType: this.model.org ? 'org' : 'orgMy', id: btn.parentNode.id }, function (res) {
                res.msg && alert(res.msg);
                if (res.success) {
                    page.reloadMenus();
                }
            }).setLoading(this.defLoading);
        }
    });

    $.Style.loadCss('../themes/box-default/setting.css?' + $.pathPart);
    window.page = new $.box.FolderMenuManage()
    page.show();
} ()