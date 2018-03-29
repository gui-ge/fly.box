/// <reference path="../../../fly.common/fly/fly.js" />
!function () {
    var $ = fly;
    $.doc.addClass('recycle')
    var rootName = '<b><i></i>@回收站</b>'
    var fm, FM = fly.box.FileManage;

    fly.box.FileManage.extend({
        paths: [{ id: "", fileId: '', name: rootName, index: 0}],
        init: FM.prototype.init.after(function () {
            fm = this;
            this.filters.recycle = 1
        }),
        createMembers: FM.prototype.createMembers.after(function () {
            this.cmdsMenu.prepend('<a id="menu-restore" onclick="manager.restore()" class=submit-button >还原</a>')
            $('#menu-delete').text('永久删除');
            this.cmdBar.append('<button id=clear-recycle onclick="manager.clearRecycle()"><i></i><span>清空回收站</span></button>')
            this.nodeTemplate = this.listView.nodeTemplate = this.nodeTemplate.replace(/<div[^>]*class=node-commands[^>]*>/i, function ($0) {
                return $0 + '<a class=node-cmd-restore href="javascript:;" title="还原" onclick="manager.restore(\'{node.fileId}\')"></a>'
            })
        }),
        clearRecycle: function () {
            $.confirm('回收站所有文件将删除，且不可恢复，请谨慎操作。\n\n真的要清空回收站吗？', function () {
                $.post({
                    loading: fm.viewLoading,
                    url: fly.box.ajaxUrl('Recycle', 'Clear'),
                    success: function (result) {
                        if (result.success) {
                            fm.reloadFiles();
                            $.alertAuto('回收站已清空。');
                        }
                        else
                            $.alert(result.msg)
                    },
                    onError: $.onAjaxErr
                })
            })
        },
        restore: function (id) {
            var ids = id ? [id] : this.getSelectFiles('请选择要还原的文件。').select('o=>o.fileId');
            if (!ids[0])
                return
            $.confirm('确定要还原选中的 {0} 个文件吗？'.format(ids.length), function () {
                $.post({
                    loading:fm.viewLoading,
                    url: fly.box.ajaxUrl('Recycle', 'Restore'),
                    data: { ids: ids.join(',') },
                    success: function (result) {
                        if (result.success) {
                            fm.reloadFiles();
                            $.alertAuto('文件已还原。');
                        }
                        else
                            $.alert(result.msg)
                    },
                    onError: $.onAjaxErr
                })
            })
        },
        remove: function () {
            var ids = this.selectionModel.getSelections('请选择要删除的文件').select('o=>o.id')
            if (!ids[0])
                return

            $.confirm('文件永久删除后不能恢复，确定要删除选中的 {0} 个文件吗？'.format(ids.length), function () {
                $.post({
                    loading: fm.viewLoading,
                    url: fly.box.ajaxUrl('Recycle', 'Delete'),
                    data: { ids: ids.join(',') },
                    success: function (result) {
                        if (result.success) {
                            fm.reloadFiles();
                        }
                        else
                            $.alert(result.msg)
                    },
                    onError: $.onAjaxErr
                })
            });
        },
        showMoreBox: function () { }
    })
} ();