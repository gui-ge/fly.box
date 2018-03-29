/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    fly.base.DepartmentList = $.Class({
        name:'部门',
        base: fly.base.ListBase,
        pageUrl: $.base.ajaxUrl($.base.pageContext.module, 'PageData', "parentId={o.record ? record.Id : ''}"),
        createGrid: function () {
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
    window.page = new fly.base.DepartmentList()
    page.show();
} ()