/// <reference path="../../common/common.js" />
!function () {
    var $ = fly;
    window.indexPath = '../'
    $(function () {
        var docTitle = $('#doc-title');
        var frame = $("#frame-wrap iframe");
        var aDown = $('#a-down');
        var id = $.getQuery('id');
        var code = $.getQuery('c');
        var title = $.getQuery('name') || '';
        try {
            title = decodeURIComponent(title)
        } catch (e) { }
        document.title = title;
        docTitle.text(title).attr('title', title);
        aDown.attr('href', "../../d.ashx/id-" + id + (code ? "~c-" + code : '') + "/" + title)

        function changeState(loaded) {
            $.doc[loaded ? 'addClass' : 'removeClass']('loaded');
            if (loaded)
                clearInterval(checkLoadHandle)
        }


        frame[0].onreadystatechange = function () {
            var state = frame[0].readyState
            changeState(state == "interactive" || state == 'complete')
        }

        if (!$.browser.isIE) {
            var checkLoadHandle = 0
            var checkLoadHandle = setInterval(function () {
                if (frame[0].contentWindow.document.body) {
                    changeState(true);
                }
            }, 50);

            frame[0].onload = function () {
                changeState(true)
            }
        }
        $.post($.box.ajaxUrl('SpaceFile', 'GetOpenList', "$no-login"), {
            id: id,
            c: code,
            sortExpression: $.getQuery('sort'),
            sortDirection: $.getQuery('sort-dir'),
            ex:'mp3',
            type: 'audio'
        }, function (result) {
            if (!result.success) {
                alert(result.message)
                return
            }
            window.musics = result.data;
            frame.attr('src', "../plugins/audio-player/player.htm?current={0}".format(id));
            //var musics = result.data.select('o=>o.id+","+o.name').join('|');
            //location.href = "../plugins/audio-player/player.htm?current={0}&list={1}".format(id, musics);
        });


    });
} ();