!function ($) {
    $.base.on('beforecreatepage', function () {
        try {
            if ($.box.Personal) {
                $('#page-left-block ul').append('<li><a id="base" href="../../fly.base/common/form.htm?m=user&form=account">帐号设置</a></li>');
            }
        } catch (e) { }

        try {
            if ($.box.Setting && $.box.isWithOrg) {
                setTimeout(function () {
                    window.page.titleBlock.$('a:last').before('<a class=tab href="../plugins/flyBaseCenter/index.htm">基础资料</a>');
                });
            }
        } catch (e) { }
    });
} (fly)