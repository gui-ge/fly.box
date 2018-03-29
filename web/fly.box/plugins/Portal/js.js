!function () {
    var $ = fly;
    $.base.on('beforecreatepage', function () {
        try {
            if ($.box.Index) {
                $('#user-name').attr({ href: "../u-share.aspx/", 'title': "我的分享主页", target: '_blank' })
            }
            else if ($.box.OrgIndex) {
                var handle = setInterval(function () {
                    var orgA = $('#a-org-name');
                    if (orgA[0]) {
                        orgA.attr({ href: "../index.aspx", 'title': userContext.org.name + "-企业分享中心", target: '_blank' })

                        var userA = $('#a-user-name');
                        userA.attr({ href: "../u-share.aspx/", 'title': "我的分享主页", target: '_blank' })
                        clearInterval(handle);
                    }
                }, 1000);
            }
        } catch (e) { }

        if (fly.box.FileManage && location.href.contains('share-to')) {
            var context = $.box.getUserContext(null, false);
            var url = location.href.replace(/fly\.box\/file\/.*/gi, 'u-share.aspx/' + context.user.login)
            $('#path-bar').append('<a href="{0}" target=_blank style="width:auto;max-width:500px;background:none" title="复制告诉你的朋友吧" >我的分享主页：{0}</a>'.format(url))
        }
    });
} ()