/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    var pageHtml = ['<div id=top-empty></div>',
                    parent.isSettingPage ? '' : '<div id="title-block">{title}</div>',
                    '<div id="list-container" class="nolink a-button">',
                    '</div>'].join('')
    $.box.TagList = $.Class({
        name: "单位",
        title: '单位空间分配',
        base: $.base.ListBase,
        pageFormat: pageHtml,
        pageUrl: $.base.ajaxUrl('org', 'OrgsSpace', "parentId={o.record ? record.Id : ''}"),
        setSpace: function (roleId, size, input) {
            size = Number(size)
            var record = this.grid.tree.allNodes.dataMap[roleId].record;
            if (record.oldSize == size)
                return;
            if (isNaN(size)) {
                $.alert('输入有误。')
                return;
            }
            input = $(input);

            $.post({
                url: $.box.ajaxUrl('org', 'setSpaceSize'),
                data: {
                    size: size * 1073741824,
                    orgId: roleId
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
                plugins: new $.ui.grid.plugins.TreeGrid({sm:null,showCheckbox:false}),
                columns: [{
                    dataIndex: "Name",
                    header: "单位名称"
                }, {
                    dataIndex: "Size",
                    header: "空间大小(G)",
                    renderer: function (v, cell) {
                        v = cell.record.SpaceSize;
                        return '<input value="{0}" style="width:80px" onchange="page.setSpace(\'{Id}\',this.value,this)" /> G'.format(v ? ((v || 0) / 1073741824).toFixed(1) : "", cell.record)
                    }
                }]
            });
        }
    });
    window.page = new $.box.TagList()
    page.show();
} ()