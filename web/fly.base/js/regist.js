/// <reference path="../common/common.js" />
!function () {
    var $ = fly;
    window.indexPath = '';
    var toUrl = $.getQuery('to');
    $.base.Regist = $.Class({
        constructor: function () {
            this.createMembers();
            this.init();
        },
        createMembers: function () {
            this.btnRegist = $('#regist');
            this.btnCancel = $('#cancel');

            $(".empty-box input").each(function () {
                new $.ui.EmptyBox(this);
            })

            if (toUrl) {
                this.btnCancel.attr('href', toUrl);
            }
            else {
                this.btnCancel.hide();
            }

            var h = fly.ui.Validate.defaultHandlers.cssAndTooltip("f-v-error", true, true)
            var validater = new fly.ui.Validate({
                container: document.forms[0],
                events: { blur: h },
                handler: h,
                hideTipOnBlur: true
            });

            this.btnRegist.onClick(function () {
                $.Event.stop(true)
                var msgs = validater.validate()
                if (msgs) {
                    alert("输入有误:\r\n" + msgs[0])
                    validater.items.first("o=>!o.isValidate").element.focus();
                    return false
                }
                var values = $(document.forms[0]).vals();
                $.post("do/RegistUser.ashx", values, function (res) {
                    if (res.success) {
                        var msg = '恭喜你，你已成功注册为系统用户，请牢记你的登录名和密码！'
                        if (page.registSetting.registUserNeedAudit) {
                            msg += '\r\n审核通过后即可登录系统，请耐心等待。'
                        }

                        alert(res.msg || msg);

                        toUrl && window.open(toUrl, '_top');
                    }
                    else {
                        alert(res.msg || '注册失败。');
                    }
                })
                return false
            });

        },
        init: function () {
            $.post("do/RegistInit.ashx", function (res) {
                if (res.msg)
                    alert(res.msg);
                page.registSetting = res.data;
                if (!page.registSetting.canRegistUser) {
                    $('form').hide();
                    alert('系统已对外关闭注册，请联系系统管理员注册。');
                    window.open(toUrl, '_top');
                }
            })
        }
    })

    $(function () {
        window.page = $.base.createPage(function () {
            return new $.base.Regist();
        })
    });
} ();