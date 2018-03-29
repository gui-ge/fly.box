/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly, roleName = $.getQuery('name');
    fly.base.RoleAuthority = $.Class({
        base: $.base.FormBase,
        title: '管理组用户成员-' + roleName,
        roleName: roleName,
        isAdd: false,
        getModelUrl: $.base.ajaxUrl('role', 'getUserInfos'),
        save: function (isAddTo) {
            var nodes = this.orgTree.getCheckItems();
            var users = nodes.where('o=>o.iconCss == "node-user"');

            $.post($.base.ajaxUrl(this.module, 'assignUser'), {
                id: $.base.pageContext.id,
                users: users.select("o=>o.id").join(',')
            }, this.saveSuccess);
            return false;
        },
        createTree: function () {
            var departs = this.model.departments;
            var users = this.model.users;
            var roleUsers = this.model.roleUsers;
            users.each(function (u) {
                u.iconCss = 'node-user';
                u.text = u.name
                u.checked = roleUsers.contains(u.id)
            });

            departs.each(function (d) {
                d.iconCss = "node-dept"
                d.text = d.name
                d.children = departs.where("o=>o.parentId=='{0}'".format(d.id));
                d.children.addRange(users.where("o=>o.departmentId=='{0}'".format(d.id)));
            });

            var items = departs.where("o=>!o.parentId");
            items[0] && (items[0].expanded = true);
            $.common.createTree({
                selectionMode: 'none',
                checkEvents: { panel: 'click' },
                checkMode: 'multi',
                checkCascade: true,
                items: items
            }, function (tree) {
                page.orgTree = tree
                tree.render(page.treeContainer[0]);
            });
        },
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            this.contentBlock.border("0px")
            this.treeContainer = $("#treeContainer");
            this.createTree();
        }
    });
    window.page = new fly.base.RoleAuthority()
    page.show();
} ()