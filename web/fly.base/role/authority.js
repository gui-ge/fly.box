/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.base.RoleAuthority = $.Class({
        base: $.base.FormBase,
        title: '用户组授权',
        buttons: ['<a id="btn-addTo" onclick="page.save(true)" class="btn-form btn-addTo" title="在用户组已有权限上追加">批量追加</a>',
                    '<a id="btn-replace" onclick="page.save(false)" class="btn-form btn-replace" title="覆盖后用户组有且仅有这些权限">批量覆盖</a>',
                    'cancel'],
        isAdd: false,
        getModelUrl: $.base.ajaxUrl('role', 'getAuthorityInfo', 'ids=' + $.base.pageContext.ids),
        save: function (isAddTo) {
            var nodes = this.moduleTree.getCheckItems();
            var plugins = nodes.where('o=>o.iconCss == "node-plugin"');
            var modules = nodes.where('o=>o.iconCss == "node-module"');
            var funcs = nodes.where('o=>o.iconCss == "node-fun"');

            $.post($.base.ajaxUrl(this.module, 'authority'), {
                roleIds: $.base.pageContext.ids,
                pluginIds: plugins.select("o=>o.id").join(','),
                moduleIds: modules.select("o=>o.id").join(','),
                funcIds: funcs.select("o=>o.id").join(','),
                isAddTo: !!isAddTo
            }, this.saveSuccess);
            return false;
        },
        createTree: function () {
            var plugins = this.model.plugins;
            var modules = this.model.modules;
            var funcs = this.model.funcs;
            funcs.each("o=>o.iconCss='node-fun'");
            modules.each(function (m) {
                m.iconCss = "node-module"
                m.children = funcs.where("o=>o.moduleId=='{0}'".format(m.id));
                m.children.addRange(modules.where("o=>o.parentId=='{0}'".format(m.id)));
            });

            plugins.each(function (p) {
                p.iconCss = "node-plugin"
                p.children = modules.where("m=>m.parentId==null && m.pluginId=='{0}'".format(p.id));
            })
            plugins[0] && (plugins[0].expanded = true);
            $.common.createTree({
                selectionMode: 'none',
                checkMode: 'multi',
                checkCascade: true,
                items: plugins
            }, function (tree) {
                page.moduleTree = tree
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
            this.roleIds = $.base.pageContext.ids
            if (this.roleIds.split(',').length < 2) {
                this.btnAddTo.hide();
                this.btnReplace.text("保存");
            }
        }
    });
    window.page = new fly.base.RoleAuthority()
    page.show();
} ()