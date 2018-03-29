/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    fly.base.RoleList = $.Class({
        name: "用户组",
        base: $.base.ListBase,
        buttons: ['add', 'edit', 'remove'
        //,'<a id="btn-authority" onclick="page.authority()" >分配权限</a> '
        ],
        commandColButtons: [
        //'<a onclick="page.authority(\'{Id}\')" class="btn-16 btn-authority" title="分配权限" ></a>',
            '<a href="form.htm?m=role&form=manage-user&id={Id}&name={Name}" class="btn-16 btn-manageUser" title="管理组内用户" ></a>',
            "edit", "remove"],
        authority: function (id) {
            var ids = id ? [id] : this.grid.getSelectionIds($.base.lang.noSelected.format("分配权限", '用户组'))
            if (!ids.length)
                return false
            location.href = 'form.htm?m=role&form=authority&ids=' + ids.join()
        },
        createGrid: function () {
            this.$base.createGrid.call(this, {
                columns: [$.common.createSelection(), {
                    dataIndex: "Name",
                    header: "名称",
                    renderer: function (v, cell) {
                        if (cell.record.IsPublic)
                            return "<font color=red>" + v + "</font>"
                        return v;
                    }
                }, {
                    dataIndex: "IsManager",
                    header: "后台管理员",
                    renderer: function (v) {
                        return v ? "是" : "否"
                    }
                }, {
                    dataIndex: "IsPublic",
                    header: "公共组",
                    renderer: function (v) {
                        return v ? "是" : "否"
                    }
                }, {
                    renderer: this.commandColRenderer()
                }]
            });
        }
    });
    window.page = new fly.base.RoleList()
    page.show();
} ()