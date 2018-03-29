/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    var pageHtml = ['<div id=top-empty></div><div id="title-block">{title}</div>',
                    '<div id="list-container" class="nolink a-button">',
                    '</div>'].join('')

    var withOrg = !!$.getQuery('$with-org')

    $.box.TagList = $.Class({
        name: "标签",
        title:withOrg?'企业标签': '我的标签',
        base: $.base.ListBase,
        //pageFormat: pageHtml,
        buttons: ['add', 'remove'],
        pageUrl: $.base.ajaxUrl($.box.pageContext.module, 'PageData'),
        createGrid: function (tag) {
            var me = this;
            this.editing = new $.ui.grid.plugins.Editing({
                afterCancel: function (row) {
                    if (row.isNew)
                        me.grid.removeRow(row)
                },
                beforeComplete: function (row, dirty, record) {
                    if (!dirty.TagName) {
                        alert('请输入标签');
                        return $.CANCEL;
                    }

                    if (!row.isNew) {
                        dirty.id = row.record.TagName;
                    }

                    $.post($.box.ajaxUrl('Tag', 'Save'), dirty, function (result) {
                        if (result.msg)
                            alert(result.msg)
                        if (result.success)
                            page.refresh();
                    });
                }
            });
            this.$base.createGrid.call(this, {
                columns: [$.common.createSelection(), {
                    dataIndex: "TagName",
                    header: "名称",
                    format: '<a href="../file/manage.htm?tag={0}&' + (withOrg ? '$with-org=1' : '') + '">{0}</a>',
                    editor: new $.ui.grid.plugins.Editing.TextEditor()
                }, {
                    dataIndex: "FileCount",
                    width: 100,
                    header: "文件数",
                    format: '<a href="../file/manage.htm?tag={TagName}&' + (withOrg ? '$with-org=1' : '') + '">{0}</a>'
                }, {
                    renderer: this.commandColRenderer(['remove'])
                }],
                plugins: [this.editing]
            });
            this.store.onRequested(function (result, opt) {
                result.data.each(function () {
                    this.Id = this.TagName;
                });
            });
        },
        add: function () {
            var row = this.grid.addRow({}, 0);
            row.isNew = true;
            this.editing.beginEdit(row);
        }
    });
    window.page = new $.box.TagList()
    page.show();
} ()