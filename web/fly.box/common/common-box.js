/// <reference path="../../fly.common/fly/fly.js" />
/// <reference path="../js/lang.js" />

!function () {
    var $ = window.fly;
    if (!$)
        return;

    $.box.typeVals = {
        share:-4,
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
                'ai,fla,psd,swf,3gp|3g2|3gp2|3gpp,avi,flv,mov,rm,rmvb,wmv,mpg|mpe|mpeg|mp4|mpeg4,video|asf|ram|m1v|m2v|mpe|mpeg|mpg|m4b|m4p|m4v|vob|divx|mkv|ogm|ogv|webm|ass|srt|ssa,' +
                'error,folder,folder-document,folder-photo,folder-music,folder-video,folder-sync,folder-message,multi-files,folder-accessory,folder-recycle,folder-recent,folder-shared,folder-continue,folder-favorite,folder-offline,folder-search,folder-link';

    var css = [];
    exs.split(',').each(function (es) {
        es = es.split('|')
        es.each(function (e) {
            css.push('.ex-' + e + ' .node-icon{background-image:url(' + indexPath + 'themes/imgs/file/32/' + es[0] + '.gif)}')
            css.push('.view-icon .ex-' + e + ' .node-icon{background-image:url(' + indexPath + 'themes/imgs/file/100/' + es[0] + '.gif)}')
        })
    })
    $.Style.createSheet(css.join(' '));


    var _top = $.myTop()
    window.openApp = function (app, config) {
        var url = app.url;
        var type = app.type;

        if (type == 'folder') {
            url = indexPath + "do/openfolderexplorer?id=" + app.id;
        }
        else if (app.ex == 'url') {
            window.open(indexPath + 'do/openurl.ashx?file-id=' + file.id, '_blank');
            return null;
        }
        else {
            if (app.ex != "oapp" && app.id) {
                var f = 'open-doc.htm';
                var id = app.id;

                if (type == 'unknow' || type == $.box.typeVals.unknow) {
                    if (confirm("该文件暂不支持预览，需要作为文本格式打开吗？"))
                        id += "-txt";
                    else
                        return null
                }

                var url = "{0}file/{1}?id={2}".format(
                        indexPath || '',
                        f,
                        id)
                window.open(url, "_blank");
                return null;
            }
        }

        $.checkArtDialog();

        var _art = _top.art;
        var left = _art.dialog.position || 70;
        left -= 5;
        _art.dialog.position = left;

        var id = app.single ? app.id : app.id + "_" + Math.random().toString().substr(5);
        var op = $.extend({
            id: id,
            appId: app.id,
            url: app.url,
            title: app.title || app.shortName || app.name,
            width: parseInt(app.width || 800),
            height: parseInt(app.height || 500),
            resize: true,
            fixed: true,
            left: left + '%'
        }, config);

        var d = _art.dialog.open(app.url, op, true);
        d.id = id;
        d.appId = app.id;
        return d;
    }

    $.checkArtDialog = function () {
        if (_top.art)
            return;

        _top.$.loadScript("../../fly.common/artDialog/artDialog.source.js?" + $.pathPart, false)
        _top.$.loadScript("../../fly.common/artDialog/plugins/iframeTools.source.js", false);
        _top.$.Style.loadCss('../../fly.common/artDialog/skins/twitter.css');
    }
} ();