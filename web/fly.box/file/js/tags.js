/// <reference path="../../../fly.common/fly/fly.js" />
!function () {
    var $ = fly;
    $.doc.addClass('tags')
    var rootName = '<b><i></i>@归档目录</b>'
    var fm, FM = fly.box.FileManage;

    fly.box.FileManage.extend({
        serviceClass: 'Tag',
        paths: [{ id: "", fileId: '', name: rootName, index: 0}],
        init: FM.prototype.init.after(function () {
            fm = this;
        }),
        handeFiles: function (files) {
            files.fMap = {}
            var url = location.href;
            files.each(function (f) {
                f.id = f.name;
                files[f.name] = files.fMap[f.name] = f;
                f.type = fly.box.typeMap[-2];
                f.extension = "tag";
                f.sizeDes = f.count + "个文件或目录";
            });
            return files;
        },
        onBeforeInit: function (fm, result) {
            result.data.view = 'tile';
        },
        showMoreBox: function () { },
        open: function (id) {
            var url = location.href.replace('tags', "tag=" + id);
            $.common.openFrame(window, url, { otherHtml: $.common.framePageCloseButton });
        }
    })
} ();