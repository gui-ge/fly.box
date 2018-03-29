/// <reference path="../common/form-base.js" />
!function () {
    var $ = fly
    $.box.SmsSend = $.Class({
        name: '其它',
        needUpload: true,
        isAdd: false,
        base: $.box.FormBase,
        pageFormat: [
                    '<form id="content-block" method="post" onsubmit="return false"></form>',
                    '<div id="toolbar" class=button-32  ></div>'
                    ].join(''),
        buttons: ['<a id=btn-send-sys onclick="page.send(\'sys\');return false" class="btn-form" >使用单位账户发送<i></i></a>', '<a id=btn-send-self onclick="page.send(\'self\');return false" class="btn-form">使用个人账户发送<i></i></a>', '<a id=btn-recharge target=_blank class="btn-form" >短信账户充值</a>', '<a id=btn-edit class=simple-button href="form.htm?m=sms&form=edit&id={0}">重新编辑</a>'.format($.base.pageContext.id), '<a id=btn-cancel class=simple-button href="list.htm?m=sms&list=outbox">返回</a>'],
        getModelUrl: $.box.ajaxUrl('sms', 'getById'),
        phoneReg: /(\d{11,13})|(\d{3,4}-\d{7,8})/,
        onGetModel: function (res) {
            if (!res.success)
                return;
            var numbers = res.data.sms.ToNumbers;
            var targets = numbers.split('|').select(function (n) {
                if (n.length <= 16)
                    return n;
                return n.split(',')[1].replace(')', '');
            }).join(',');
            res.data.sms.ToNumbers = targets
        },
        afterCreateForm: $.box.FormBase.prototype.afterCreateForm.after(function () {
            var sms = this.model.sms
            var desc = "共发送给：{0}，短信内容{1}个字，预计需花费{2}条短信".format(sms.NumbersDesc, sms.Content.length, sms.UseMsgCount)
            $('#sms-desc').text(desc);
        }),
        openMask: '<div id=open-mask class=mask-wrap><div>{0}</div><br/><br/><a class=submit-button target=_blank href="{1}" onclick="page.requestOpenByA(this)">点击开通</a> &nbsp; &nbsp; &nbsp;<a class=mask-close onclick="$(this.parentNode).remove();return false">×</a></div>',
        openingMask: '<div id=open-mask class=mask-wrap><a class=submit-button onclick="page.retry(this)">已成功开通短信发送功能</a> <a class=submit-button href="http://www.flyui.net/service.php" target=_blank >开通过程中遇到问题</a> &nbsp; &nbsp; &nbsp;<a class=mask-close onclick="$(this.parentNode).remove();return false">×</a></div>',
        retry: function () {
            $.post($.box.ajaxUrl('sms', 'getKey'), { by: this.lastSendBy }, function (res) {
                if (res.success) {
                    $('#open-mask').remove();
                    if (res.data)
                        page.model[page.lastSendBy + "Key"] = res.data
                    else
                        alert("还未成功绑定。");

                    page.send(page.lastSendBy);
                }
            });
        },

        //        sendBySelf: function (showMsg) {
        //            if (!this.model.selfKey) {
        //                if (showMsg !== false)
        //                    alert('您的帐号还未开通短信功能，请花一分钟时间开通，即可拥有便捷的短信发送功能。');
        //                var ret = encodeURIComponent($.toAbsUrl("../sms/sms-open.aspx"))
        //                window.open('../sms/sms-open.aspx?by=self&ret=' + ret)
        //                $.getBody().append(this.openMask);
        //                this.lastSendBy = 'self';
        //            }
        //            else {
        //                this.send('self');
        //            }
        //        },
        //        sendBySys: function (showMsg) {
        //            if (!this.model.sysKey) {
        //                if (showMsg !== false)
        //                    alert('单位帐号还未开通短信功能，你可以为单位帐号开通，也可以联系管理员开通，让大家享受便捷的短信发送功能。');
        //                var ret = encodeURIComponent($.toAbsUrl("../sms/sms-open.aspx"))
        //                window.open('../sms/sms-open.aspx?by=sys&ret=' + ret)
        //                $.getBody().append(this.openMask);
        //                this.lastSendBy = 'sys';
        //            }
        //            else {
        //                this.send('sys');
        //            }
        //        },
        requestOpenByA: function (a) {
            $('#open-mask').remove()
            $.getBody().append(page.openingMask);
        },
        requestOpen: window.requestOpen = function (by, url, showMsg) {
            var msg = by == 'sys' ? '单位帐号还未开通短信功能，你可以为单位帐号开通，也可以联系管理员开通，让大家享受便捷的短信发送功能。' : '您的帐号还未开通短信功能，请花一分钟时间开通，即可拥有便捷的短信发送功能。'
            if (showMsg !== false)
                alert(msg);
            try {
                var win = window.open(url, '_blank')
            } catch (e) {
            }

            page.removeSendingBox();
            page.lastSendBy = by
            if (win) {
                $.getBody().append(page.openingMask);
            }
            else {
                $.getBody().append(page.openMask.format(msg, url));
            }
        },
        testServer: function (serverUrl) {
            $.get(serverUrl.split('?')[0], function (res) {
                if (!res)
                    page.serverError(serverUrl)
            }, function () {
                page.serverError(serverUrl)
            })
        },
        serverError: function (serverUrl) {
            clearInterval(page.sendingTimeHandle)
            this.sendingBox.html('服务器可能出现异常，请联系管理员，检测网络<br/>是否可以访问服务器：<a href="{0}" target=_blank >{0}</a> <br/><br/> <a class=submit-button onclick=page.showSend() >返回</a>'.format(serverUrl.match(/^.{4,10}[^\/]+/)[0]))
        },
        startClientSend: window.startClientSend = function (url) {
            var clientSendTime = 0;
            clearInterval(page.sendingTimeHandle);
            page.sendingTimeHandle = setInterval(function () {
                clientSendTime++;
                page.sendingTime.text(clientSendTime);
                if (clientSendTime == 5) {
                    page.testServer(url);
                }
            }, 1000);
        },
        sending: function () {
            this.removeSendingBox();
            $.doc.addClass('sending');
            $.getBody().append('<div id=sending-box class=mask-wrap >发送中<span id=sending-time ></span></div>');
            this.sendingTime = $('#sending-time');
            this.sendingBox = $('#sending-box');
            this.sendingTimeHandle = setInterval(function () {
                var txt = page.sendingTime.text()
                page.sendingTime.text(txt.length > 3 ? "" : txt + ">");
            }, 1000)
        },
        removeSendingBox: function () {
            clearInterval(this.sendingTimeHandle);
            $('#sending-box').remove();
            $.doc.removeClass('sending');
            this.sendingBox = null;
            this.sendingTime = null;
        },
        sendEnd: window.sendEnd = function (res) {
            page.showSend();
            $.doc.removeClass('need-recharge')
            if (res.startWith("1.")) {
                $.doc.addClass('send-ok');
                alert('短信已发送');
            }
            else {
                alert('短信发送失败。   ' + res);
                if (res.contains('503')) {
                    $.doc.addClass('need-recharge')
                    $('#btn-recharge').attr('href', $.box.ajaxUrl('sms', 'goRecharge', 'by=' + page.lastSendBy))
                }
            }
        },
        send: function (by) {
            this.sending();
            this.lastSendBy = by
            var fram = $('<iframe id=frm-send src="../sms/sms.aspx?cmd=send&id={0}&by={1}" style="position:absolute;top:-10000px"></iframe>'.format(this.model.sms.Id, by));
            $.getBody().append(fram);
        },
        showSend: function () {
            this.sendingBox && this.sendingBox.remove();
            $.doc.removeClass('sending');
        }
    });

    $.doc.addClass('sms-send');
    $.Style.loadCss('../themes/box-default/sms.css?' + $.pathPart);
    window.page = new $.box.SmsSend()
    page.show();
} ()