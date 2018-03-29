$.box.on('beforecreatepage', function () {
    $.box.FileManage.extend({
        showMore: function () { },
        showMoreBox: function () { },
        addToDesktop: function () {
            var ids = this.getSelectFiles().select('o=>o.id')
            if (!ids[0])
                return;
            $.post($.box.ajaxUrl('OnlineApp', 'addToDesktopFromManage'), { ids: ids.join(',') }, function (res) {
                if (res.success) {
                    $.common.showMessage('已添加到桌面。')
                    top.desktop.loadUserData()
                }
            })
        }
    })

    $.box.FileManage.prototype.createMembers = $.box.FileManage.prototype.createMembers.before(function () {
        var menu = $('#cmds-menu')
        menu.$('a').hide();
        menu.append('<a class=add-to-desktop onclick=manager.addToDesktop() >添加到桌面</a>');
        $.doc.addClass('with-store')
    })
})