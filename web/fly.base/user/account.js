/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly
    $.base.Account = $.Class({
        name: '帐号',
        title: '帐号设置',
        base: $.base.FormBase,
        saveUrl: $.base.ajaxUrl('User', 'SaveAccount'),
        saveSuccess: function (result) {
            if (result.success)
                $.alertAuto('帐号修改成功。');
            else
                $.alertAuto(result.msg);
        },
        buttons: ['save'],
        onGetModel: function (res) {
            if (!res.modifyUserMainInfoBySelf && !$.box.getUserContext(null, false).user.isManager) {
                setTimeout(function () {
                    $('$LoginName,$NickName,$Sex').attr('title', '已禁止修改').disable();
                }, 100);
            }
        },
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            $.post($.base.ajaxUrl(this.module, "getAccount"), function (result) {
                if (result.success) {
                    page.model = result.data
                    page.initFields()
                    page.onGetModel(result);
                }
                else {
                    alert(result.msg || '获取用户信息失败。');
                }
            });
        }
    });

    window.page = new $.base.Account()
    page.show();
} ()