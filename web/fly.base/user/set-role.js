/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.base.SetRole = $.Class({
        base: $.base.FormBase,
        title: '分配组',
        buttons: ['<a id="btn-addTo" onclick="page.save(true)" class="btn-form btn-addTo" title="在用户已有用户组上追加">批量追加</a>',
                    '<a id="btn-replace" onclick="page.save(false)" class="btn-form btn-replace" title="覆盖后用户有且仅有这些用户组">批量覆盖</a>',
                    'cancel'],
        isAdd: false,
        getModelUrl: $.base.ajaxUrl('user', 'getRoleInfos', 'ids=' + $.base.pageContext.ids),
        save: function (isAddTo) {
            var nodes = this.roleTree.getCheckItems();
            if (!isAddTo && !nodes.length)
                return $.alert('至少给用户分配一个组。');

            $.post($.base.ajaxUrl(this.module, 'setRole'), {
                ids: $.base.pageContext.ids,
                roles: nodes.select("o=>o.id").join(','),
                isAddTo: !!isAddTo
            }, this.saveSuccess);
            return false;
        },
        createTree: function () {
            var roles = this.model.roles;
            roles.each(function (r) {
                //m.iconCss = "node-module"
                r.text = r.name;
            });

            $.common.createTree({
                selectionMode: 'none',
                checkMode: 'multi',
                items: roles
            }, function (tree) {
                page.roleTree = tree
                tree.render(page.treeContainer[0]);
            });
        },
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            this.contentBlock.border("0px")
            this.treeContainer = $("#treeContainer");
            this.createTree();
            this.btnAddTo = $("#btn-addTo");
            this.btnReplace = $("#btn-replace")
            this.roleIds = $.base.pageContext.ids.split(',')
            if (this.roleIds.length < 2) {
                this.btnAddTo.hide();
                this.btnReplace.text("保存");
            }
        }
    });

    window.page = new fly.base.SetRole()
    page.show();
} ()