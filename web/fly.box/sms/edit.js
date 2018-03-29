/// <reference path="../common/form-base.js" />
!function () {
    var $ = fly
    $.box.SmsSend = $.Class({
        name: '短信',
        title: '发送短信',
        needUpload: true,
        // isAdd: false,
        content: $.getQuery("content") || '',
        base: $.box.FormBase,
        pageFormat: ['<div id=top-empty></div><div id="title-block">{title}</div>',
                        '<form id="content-block" method="post" onsubmit="return false"></form>',
                        '<div id="toolbar" class=button-32  ></div>'
                    ].join(''),
        buttons: ['<a href="#" onclick="page.save();return false" class="btn-form">发送</a>', '<a class=simple-button href="list.htm?m=sms&list=outbox">发送记录</a>'],
        phoneReg: /(\d{11,13})|(\d{3,4}-\d{7,8})/,
        initTargets: function () {
            var getTarget = $.getQuery("getTarget");
            if (getTarget) {
                $.post($.box.ajaxUrl('sms', 'GetTargets'), { target: getTarget }, function (res) {
                    res.msg && alert(res.msg);
                    if (res.success && res.data) {
                        res.data.each(function (user) {
                            user.text = user.name;
                            page.toEditor.addTag(user)
                        })
                    }
                })
            }
        },
        afterCreateForm: $.box.FormBase.prototype.afterCreateForm.after(function () {
            this.toEditor = new fly.ui.TagsEditor({
                id: 'to',
                emptyValue: '输入手机号码，多个号码用逗号“,”分隔，一次最多发送给1000个号码。',
                onAddByInput: function (tag) {
                    if (page.phoneReg.test(tag))
                        return tag
                    $.common.showMessage('电话号码不正确，固话请加区号。')
                    return false
                }
            })

            this.contentEditor = new fly.ui.EmptyBox({ input: "#content", emptyValue: "短信最多300字，按60字每条计算。" });
            if (this.content)
                this.contentEditor.value(this.content)

            if (this.model && this.model.sms) {
                this.contentEditor.value(this.model.sms.Content);
                var numbers = this.model.sms.ToNumbers;
                var me = this;

                var targets = numbers.split('|').select(function (n) {
                    if (n.length <= 16)
                        me.toEditor.addTag(n)
                    else {
                        var parts = n.split(',');
                        var tag = {
                            id: parts[0].split('(')[1],
                            text: parts[1].replace(')', '')
                        }
                        me.toEditor.addTag(tag)
                        return n;
                    }
                }).join(',');
            }
            else {
                page.initTargets()
            }
            this.initUserFrame();
        }),
        initUserFrame: function () {
            var me = this, inited = false;
            this.frameSelectUser = $('#user-frame');
            var frame = this.frameSelectUser[0]
            frame.onCheck = function (item, byDom) {
                //未初始化完成或者不是用户，不改变
                if (!inited || item.type != "user")
                    return;

                var tag = { id: item.id, name: item.text }
                if (item.checked)
                    me.toEditor.addTag(tag)
                else
                    me.toEditor.deleteTag(tag)
            }

            frame.onExpand = function (node, first) {
                var isSearch = (node.text || '').contains('搜索')
                if (!first && !isSearch)
                    return;
                //是搜索的时候，充值为未初始化
                if (isSearch)
                    inited = false;

                var tags = me.toEditor.getTags();
                function check(items) {
                    items.each(function (n) {
                        n.check(tags.any(function (t) {
                            return t.id == n.id
                        }))
                        check(n.items);
                    })
                }
                check(node.items)

                //是搜索的时候，充值为初始化完成
                if (isSearch)
                    inited = true
            }

            frame.onRequestData = function (node) {
                setTimeout(function () {
                    frame.onExpand(node, true);
                    inited = true;
                }, 100)
            }
        },
        save: function () {
            var to = this.toEditor.getTags().select('o=>o.id||o').join('|')
            var content = this.contentEditor.value();
            var cmd = $.getQuery('cmd');
            var data = { to: to, content: content }
            if (cmd != 're-send' && this.model && this.model.sms)
                data.id = this.model.sms.Id;

            $.post($.box.ajaxUrl('sms', 'save'), data, function (res) {
                res.msg && alert(res.msg);
                if (res.success) {
                    location.href = "?m=sms&form=send&id=" + res.data;
                }
            })
        }
    });

    $.doc.addClass('sms-edit');
    $.Style.loadCss('../../../fly.common/fly.ui/plugins/themes/gray/tags-editor.css?' + $.pathPart)
    $.Style.loadCss('../themes/box-default/sms.css?' + $.pathPart);
    $.loadScript("../../../fly.common/fly.ui/plugins/input/empty-box.js", function () {
        $.loadScript("../../../fly.common/fly.ui/plugins/input/tags-editor.js", function () {
            window.page = new $.box.SmsSend()
            page.show();
        })
    });
} ()