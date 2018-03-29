/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    var pageHtml = ['<div id=top-empty></div>',
                    parent.isSettingPage ? '' : '<div id="title-block">{title}</div>',
                    '<div id="list-container" class="nolink a-button">',
                    '</div>'].join('')
    $.box.TagList = $.Class({
        name: "用户",
        title: '用户空间分配',
        base: $.base.ListBase,
        pageFormat: pageHtml,
        pageUrl: $.base.ajaxUrl('user', 'UsersSpace'),
        setSpace: function (userId, size, input) {
            size = Number(size)
            var record = this.grid.rows.dataMap[userId].record;
            if (record.oldSize == size)
                return;
            if (isNaN(size)) {
                $.alert('输入有误。')
                return;
            }

            input = $(input);

            $.post({
                url: $.box.ajaxUrl('user', 'setSpaceSize'),
                loading: page.listLoading,
                data: {
                    size: size * 1073741824,
                    userId: userId
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
                    dataIndex: "LoginName",
                    header: "登录名"
                }, {
                    dataIndex: "NickName",
                    header: "昵称/姓名"
                }, {
                    dataIndex: "SpaceSize",
                    header: "空间大小(G)",
                    renderer: function (v, cell) {
                        cell.record.oldSize = v;
                        return '<input value="{0}" style="width:80px" onchange="page.setSpace(\'{Id}\',this.value,this)" /> G'.format(v ? ((v || 0) / 1073741824).toFixed(1) : "", cell.record)
                    }
                }]
            });
        }
    });
    window.page = new $.box.TagList()
    page.show();
} ()