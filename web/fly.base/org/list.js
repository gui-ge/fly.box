/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    fly.base.OrgList = $.Class({
        name: "单位",
        base: fly.base.ListBase,
        removeHint: '删除单位将会删除相关的用户、部门等所有数据，真的要删除吗？   {0}',
        pageUrl: $.base.ajaxUrl($.base.pageContext.module, 'PageData', "parentId={o.record ? record.Id : ''}"),
        createGrid: function () {
            var me = this;
            this.$base.createGrid.call(this, {
                plugins: new $.ui.grid.plugins.TreeGrid({
                    sm: {
                        parentCascade: false,
                        childCascade: true
                    }
                }),
                columns: [{
                    dataIndex: "Name",
                    header: "名称"
                }, {
                    dataIndex: "ContactPerson",
                    header: "联系人"
                }, {
                    dataIndex: 'Admin',
                    header: '管理员帐号'
                }, {
                    dataIndex: "Phone",
                    header: "联系电话"
                }, {
                    dataIndex: "Address",
                    header: "地址"
                }, {
                    renderer: this.commandColRenderer()
                }]
            });
        }
    });
    window.page = new fly.base.OrgList()
    page.show();
} ()