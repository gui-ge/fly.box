/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly
    window.indexPath = '../'
    $.doc.addClass("p-work-assign p-work");
    $.box.OutboxAssignForm = $.Class({
        name: '事务',
        title: '新建通知、公告--发送',
        base: $.box.FormBase,
        getModelUrl: $.base.ajaxUrl('work', 'GetByTargets'),
        buttons: ['<a onclick="page.previous();return false">编辑</a>', '<a onclick="page.save();return false">发送</a>', '<a href="list.htm?m=oa&list=outbox">返回</a>'],
        pageFormat: ['<div id=top-empty></div><div id="title-block">{title}</div>',
                    '<div id="toolbar" class=button-32  ></div>',
                    '<form id="content-block" class="oa-view-form" method="post"></form>'].join(''),
        previous: function () {
            window.open("form.htm?m=oa&form=outbox-form&id=" + this.modelId, "_self")
        },
        save: function () {
            var targets = this.targetsEditor.getTags().select('o=>o.id').join(',');
            if (!targets) {
                alert('请选择接收者。')
                return
            }

            $.post($.box.ajaxUrl('work', 'AssignWork'), { id: this.modelId, targets: targets }, function (result) {
                result.msg && $.alert(result.msg);
                if (result.success) {
                    window.open('list.htm?m=oa&list=outbox', '_self')
                }
            }, $.common.onAjaxErr);
        },
        createMembers: function () {
            this.dWin = window.parent || window;
            this.indexPath = this.dWin.indexPath || '';
            this.$base.createMembers.apply(this, arguments);
        },

        afterCreateForm: function () {
            var me = this;
            this.$base.afterCreateForm.apply(this, arguments);

            this.targetsEditor = new fly.ui.TagsEditor({
                id: 'assign-targets',
                //input: '#target-input',
                tags: this.model.targets,
                onExists: function () {
                    return false
                }
            })

            this.targetFrame = $("#target-frame");
            var frame = this.targetFrame[0]
            frame.onCheck = function (item) {
                if (item.type != "user")
                    return;

                var tag = { id: item.id, name: item.text }
                if (item.checked)
                    me.targetsEditor.addTag(tag)
                else
                    me.targetsEditor.deleteTag(tag)
            }

            frame.onExpand = function (node) {
                var tags = me.targetsEditor.getTags();
                node.items.each(function (n) {
                    n.check(tags.any(function (t) {
                        return t.id == n.id
                    }))
                })
            }

            frame.onRequestData = function (node) {
                setTimeout(function () {
                    frame.onExpand(node);
                }, 100)
            }
        }
    });

    ['../themes/box-default/oa/css.css?' + $.pathPart, '../../fly.common/fly.ui/plugins/themes/gray/tags-editor.css?' + $.pathPart].each($.Style.loadCss);

    $.loadScript("../../fly.common/fly.ui/plugins/input/empty-box.js?" + $.pathPart, function () {
        $.loadScript("../../fly.common/fly.ui/plugins/input/tags-editor.js?" + $.pathPart, function () {
            window.page = new $.box.OutboxAssignForm();
            page.show();
        });
    })
} ()