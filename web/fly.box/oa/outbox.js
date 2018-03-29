/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    var pageHtml = ['<div id=top-empty></div><div id="title-block">{title}</div>',
                    '<div id="list-container" class="nolink a-button">',
                    '</div>'].join('')
    $.box.OutboxList = $.Class({
        name: "发件",
        title: '我发起的 <a href="form.htm?m=oa&form=outbox-form" class=submit-button style="margin-left:100px">新建事务...</a>',
        base: $.base.ListBase,
        form: 'outbox-form',
        service: 'work',
        pageFormat: pageHtml,
        pageUrl: $.base.ajaxUrl('work', 'Outbox'),
        removeAction: 'OutboxDelete',
        createGrid: function () {
            var me = this;
            this.$base.createGrid.call(this, {
                rowEvents: {
                    click: function (row, cell) {
                        if (cell.column.dataIndex == 'flowNO' || cell.column.dataIndex == 'title')
                            location.href = 'form.htm?m=oa&form=outbox-process-detail-form&id=' + row.record.id
                    }
                },
                columns: [{
                    dataIndex: 'flowNO',
                    header: '流水号',
                    css: 'c-flow-no c-cell-bold',
                    renderer: function (no, cell) {
                        var rec = cell.record
                        rec.processTitle = "发送给{targetCount}人，{receiveCount}人已接收，{processCount}人已办理".format(rec);
                        return '<span style="{0}">{flowNO}</span> &nbsp; <span class=gray >{processTitle}</span>'.format(rec.isBold ? "font-weight:bold" : "", rec);
                        //                        var recPercent = (rec.receiveCount * 100 / rec.targetCount).toFixed(0) + "%"
                        //                        var processPercent = (rec.processCount * 100 / rec.targetCount).toFixed(0) + "%"
                        //                        return '<span style="{6}">{0}</span><div class=oa-process ><span title="已接收 {1}/{5}、{2}" style="width:{2};background:yellow"></span><span title="已办理 {3}/{5}、{4}" style="width:{4}"></span></div>'.
                        //                            format(no, rec.receiveCount, recPercent, rec.processCount, processPercent, rec.targetCount, rec.isBold ? "font-weight:bold" : "")
                    }
                }, {
                    dataIndex: "title",
                    header: "标题",
                    css: 'c-title c-cell-bold',
                    renderer: function (title, cell) {
                        if (cell.record.isBold)
                            cell.el.css("font-weight", "bold");
                        return title;
                    }
                }, {
                    dataIndex: "createTime",
                    header: "创建时间",
                    renderer: function (v, cell) {
                        return v.format($.box.dt2Format);
                    }
                }, {
                    header: "",
                    dataIndex: 'id',
                    renderer: function (id, cell) {
                        if (cell.record.isBold)
                            cell.row.el.addClass('f-row-bold')

                        return '<a href="form.htm?m=oa&form=outbox-form&id={0}">编辑</a> <a href="form.htm?m=oa&form=outbox-assign-form&id={0}">发送</a> <a href="form.htm?m=oa&form=outbox-process-detail-form&id={0}" title={1}>办理详情</a> <a href=# onclick="page.remove(\'{0}\');return false" >删除</a> '.format(id, cell.record.processTitle);
                    }
                }]
            });
        }
    });
    $.Style.loadCss('../themes/box-default/oa/css.css?' + $.pathPart);
    window.page = new $.box.OutboxList()
    page.show();
} ()