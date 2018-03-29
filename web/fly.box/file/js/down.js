/// <reference path="../../common/common.js" />
!function () {
    var $ = fly;
    $.box.Download = $.Class({
        constructor: function () {
            this.init();
            this.createCompression();
        },
        init: function () {
            this.statusBar = $('#down-status');
            this.progressBar = $('#progress');
            this.startDownBar = $('#start-down');
            this.downErrorBar = $('#down-error');
        },
        downloadZip: function (compId, size) {
            this.startDownBar.show();
            var downUrl = '../d.ashx/comp-' + compId+".zip";
            this.startDownBar.$('a').attr('href', downUrl);
            this.startDownBar.html(this.startDownBar.html() + ' ' + $.sizeFormat(size))
            $.getBody().append('<iframe style="position:absolute;top:-10000px" src="{0}"></iframe>'.format(downUrl))
        },
        downloadZipError: function (msg) {
            this.downErrorBar.show();
            this.downErrorBar.html(msg);
        },
        nearZipSize: [],
        onCompression: function (comp) {
            this.progressBar.html(comp.progress + '% ' + (comp.size < 0 ? '&nbsp; 已压缩 ' + $.sizeFormat(Math.abs(comp.size)) : ""));
            if (comp.size >= 0) {
                this.downloadZip(comp.compId, comp.size)
            }
            else {
                this.nearZipSize.push(comp.size);
                if (comp.msg) {
                    this.downloadZipError(comp.msg);
                    return;
                }
                else if (this.nearZipSize.length > 10) {
                    this.nearZipSize.shift();
                    if (this.nearZipSize.max() == this.nearZipSize.min()) {
                        this.downloadZipError("下载失败，创建压缩包可能出错。");
                        return;
                    }
                }

                setTimeout(function () {
                    $.post($.box.ajaxUrl("Compression", 'GetInfo'), { id: comp.compId }, function (res) {
                        if (res.success) {
                            page.onCompression(res.data);
                        }
                        else {
                            page.downloadZipError(res.msg);
                        }
                    })
                }, 1000);
            }
        },
        createCompression: function () {
            var ids = $.getQuery('id');
            var code = $.getQuery('c') || $.getQuery('code');
            $.post("../d.ashx", { id: ids, code: code, compression: 1 }, function (res) {
                if (res.success) {
                    page.onCompression(res.data);
                }
                else {
                    page.downloadZipError(res.msg);
                }
            }, function () {
                alert('创建压缩包出现异常');
            })
        }
    });

    $(function () {
        window.page = new $.box.Download();
    });
} ()