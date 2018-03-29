/// <reference path="../../common/common.js" />
!function () {
    $ = fly;
    window.indexPath = '../'
    $.box.typeVals = {
        tag: -2,
        folder: -1,
        unknow: 0,
        image: 1,
        audio: 2,
        video: 4,
        compress: 8,
        app: 16,
        doc: 32
    };

    var exs = 'doc|docx|docm|dot|dotx|dotm,log,pdf,ppt|pptx|pptm,xls|xlsx|xlsm|xltx|xltm|xlam|xlsb,' +
                'url,txt,bat,exe,ipa,apk,msi,dmg,iso,rar,zip,7z,cab,asp,c|cpp,css,html|htm,js,php,tpl,xml|config,code|plist|h|cs,chm,' +
                'gif,jpg|jpeg,png,img|bmp|tiff|exif|raw,' +
                'mp3,wma,music|wav|midi|flac|ram|ra|mid|aac|m4a|ape|au|ogg,' +
                'ai,fla,psd,swf,3gp|3g2|3gp2|3gpp,avi,flv,mov,rm,rmvb,wmv,mpg|mpe|mpeg|mp4|mpeg4,video|asf|ram|m1v|m2v|mpe|mpeg|mpg|m4b|m4p|m4v|vob|divx|mkv|ogm|webm|ass|srt|ssa,' +
                'error,folder,folder-document,folder-photo,folder-music,folder-video,folder-sync,folder-message,multi-files,folder-accessory,folder-recycle,folder-recent,folder-shared,folder-continue,folder-favorite,folder-offline,folder-search,folder-link';

    var css = [];
    exs.split(',').each(function (es) {
        es = es.split('|')
        es.each(function (e) {
            css.push('.ex-' + e + ' #icon{background-image:url(../themes/imgs/file/100/' + es[0] + '.gif)}')
        })
    })
    $.Style.createSheet(css.join(' '));


    $.box.FileInfo = $.Class({
        constructor: function () {
            this.fileId = $.getQuery('id');
            this.loadInfos();
        },
        loadInfos: function () {
            $.post($.box.ajaxUrl('SpaceFile', 'GetInfos'), { id: this.fileId }, function (res) {
                res.msg && alert(res.msg);
                if (res.success) {
                    page.fileInfo = res.data;
                    page.showIcon();
                    page.showInfos();
                }
            });
        },
        showIcon: function () {
            var iconImg = $('#icon img');
            //var ids = $.getQuery('ids').split(','), ex = $.getQuery('ex'), type = $.getQuery('type');
            if (this.fileInfo.ex)
                $.doc.addClass('ex-' + this.fileInfo.ex);

            if (this.fileInfo.type == $.box.typeVals.image) {
                iconImg[0].src = fly.box.ajaxUrl('SpaceFile', 'Thumb', 'size=100&id=' + ids[0]);
            }
            else {
                iconImg.hide();
            }

            //            if (ids.length == 1) {
            //                $.post($.box.ajaxUrl('SpaceFile', 'GetInfo', 'id=' + ids[0]), function (result) {
            //                    if (result.success)
            //                        showInfos(result.data);
            //                    else
            //                        $.alert(result.msg)
            //                })
            //            }
            //            else {
            //                showMultiInfo()
            //            }
        },
        showMultiInfo: function () {
            var fileCount = parseInt($.getQuery('f-count'));
            var folderCount = parseInt($.getQuery('d-count'));
            $.getBody().addClass('is-multi');
            if (fileCount)
                $('#file span').text(fileCount + '个')
            else
                $('#file').hide()
            $('#size span').text($.sizeFormat($.getQuery('total')))

            if (folderCount)
                $('#folder span').text(folderCount + '个')
            else
                $('#folder').hide();

            $('#time').hide();
            $('#fields').show();
        },
        showInfos: function () {
            $('#time span').text(this.fileInfo.time.format('yy-MM-dd HH:mm'))
            $('#size span').text($.sizeFormat(this.fileInfo.size))

            if (this.fileInfo.type < 0) {
                $.getBody().addClass('is-folder');
                $('#file span').text(this.fileInfo.fileCount + '个')
                $('#folder span').text(this.fileInfo.folderCount + '个')
            }
            else {
                $.getBody().addClass('is-file');
                $('#size label').text('大小：');
            }

            if (this.fileInfo.tags) {
                $('#tags span').text(this.fileInfo.tags).parent().show()
            }
            if (this.fileInfo.summary) {
                $('#summary span').text(this.fileInfo.summary).parent().show()
            }
            $('#fields').show();
        }
    })

    window.page = $.box.createPage(function () {
        return new $.box.FileInfo()
    });
} ();





