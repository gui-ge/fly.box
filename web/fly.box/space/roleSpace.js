/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    var pageHtml = ['<div id=top-empty></div>',
                    parent.isSettingPage ? '' : '<div id="title-block">{title}</div>',
                    '<div id="list-container" class="nolink a-button">',
                    '</div>'].join('')
    $.box.TagList = $.Class({
        name: "用户组",
        title: '用户组空间分配',
        base: $.base.ListBase,
        pageFormat: pageHtml,
        pageUrl: $.base.ajaxUrl('role', 'RolesSpace'),
        setSpace: function (roleId, size, input) {
            size = Number(size)
            var record = this.grid.rows.dataMap[roleId].record;
            if (record.oldSize == size)
                return;
            if (isNaN(size)) {
                $.alert('输入有误。')
                return;
            }

            input = $(input);

            $.post({
                url: $.box.ajaxUrl('role', 'setSpaceSize'),
                loading: page.listLoading,
                data: {
                    size: size * 1073741824,
                    roleId: roleId
                },
                success: function (result) {
                    if (result.success) {
                        //page.refresh()
                        input.css('border', '')
                    }
                    else {
                        input.css('border', '1px solid red')
                        $.alert(result.msg)
                    }
                },
                error: $.onAjaxErr
            })
        },
        createGrid: function () {
            var me = this;
            this.$base.createGrid.call(this, {
                columns: [{
                    dataIndex: "Name",
                    header: "用户组"
                }, {
                    dataIndex: "Size",
                    header: "空间大小(G)",
                    renderer: function (v, cell) {
                        v = cell.record.oldSize = v || cell.record.DefaultSize;
                        return '<input value="{0}" style="width:80px" onchange="page.setSpace(\'{Id}\',this.value,this)" /> G'.format(v ? ((v || 0) / 1073741824).toFixed(1) : "", cell.record)
                    }
                }, {
                    dataIndex: "IsPublic",
                    header: "公共组",
                    renderer: function (v) {
                        return v ? "是" : "否"
                    }
                }]
            });
        }
    });
    window.page = new $.box.TagList()
    page.show();
} ()