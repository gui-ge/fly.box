!function () {
    var $ = fly;
    window.indexPath = flyBox.appUrl + 'fly.box/';
    window.praise = function (a) {
        a = $(a);
        var isPraised = a.hasClass('share-praised');
        $.post(flyBox.appUrl + 'fly.box/ajax.ashx?$c=Share&$m=' + (isPraised ? 'Un' : '') + 'Praise', { id: shareId }, function (res) {
            res.msg && alert(res.msg);
            if (res.success) {
                a[isPraised ? 'removeClass' : 'addClass']('share-praised');
                a.$('span').text('赞(' + res.data + ')')
                a.attr('title', isPraised ? '赞一个吧' : '不赞了');
            }
        })
        return false
    }


    function addComment(comment) {
        var format = '<div id=comment-{id} class=comment>' +
                '<a class=btn-del-comment onclick=delComment("{shareId}","{id}") >删除</a>' +
                '<div class=comment-info ><span class=comment-time>{time.format("yyyy-MM-dd hh:mm")}</span> <span class=comment-user >{userName}<span></div>' +
                '<div class=comment-content>{content}</div>' +
            '</div>';
        var html = format.format(comment);
        $('#comments').append(html);
    }

    window.comment = function () {
        var content = $('#txt-comment').val().trim();
        if (!content) {
            alert('请输入评论内容。');
            return false;
        }

        $.post(flyBox.appUrl + 'fly.box/ajax.ashx?$c=Share&$m=Comment', { id: shareId, content: content }, function (res) {
            res.msg && alert(res.msg);
            if (res.success) {
                res.data.content = content;
                res.data.time = new Date()
                res.data.shareId = shareId;
                addComment(res.data);
                $('#txt-comment').val('')
            }
        })
        return false;
    }

    window.delComment = function (shareId, id) {
        if (!confirm('删除后不能恢复，真的删除吗？'))
            return;

        $.post(flyBox.appUrl + 'fly.box/ajax.ashx?$c=Comment&$m=Delete', { infoId: shareId, type: 'Share', id: id }, function (res) {
            res.msg && alert(res.msg);
            if (res.success) {
                $('#comment-' + id).fadeOut('fast', function () {
                    $('#comment-' + id).remove();
                });
            }
        })
        return false;
    }

    window.saveTo = function () {
        var frame = $('#frame-share-files')
        frame[0].contentWindow.page.saveTo(0, true);
        return false;
    }

    window.validatePassword = function () {
        var pwd = $('#password-box').val().trim();
        if (!pwd)
            alert('请输入提取密码。');
        else {
            $.post(flyBox.appUrl + 'fly.box/ajax.ashx?$c=Share&$m=ValidatePassword&$no-login', { id: shareId, pwd: pwd }, function (res) {
                res.msg && alert(res.msg);
                if (res.success) {
                    location.href = res.data.url
                }
            })
        }
        return false;
    }
} ();