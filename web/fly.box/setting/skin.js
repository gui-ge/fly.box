/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly
    $.box.Skin = $.Class({
        name: '皮肤',
        base: $.box.FormBase,
        pageFormat: ['<div id="toolbar" class=button-32  ></div>',
                    '<form id="content-block" method="post"></form>'].join(''),
        buttons: [],
        /*save: function () {
        if (!page.currentSkin) {
        return $.alert('请选择你喜欢的皮肤。');
        }
        var skin = page.currentSkin
        $.post($.box.ajaxUrl('skin', 'set'), {
        skin: skin.getAttribute('skin')
        }, function (result) {
        if (result.success) {
        $.alert('你已选择皮肤“{0}”。'.format(skin.getAttribute('skinName')));
        }
        else {
        $.alert(result.msg)
        }
        })
        },*/
        save: function () {
            var skin = page.currentSkin
            $.post($.box.ajaxUrl('skin', 'set'), {
                skin: skin.getAttribute('skin')
            }, function (result) {
                if (result.success) {
                    $.common.showMessage('你已选择皮肤“{0}”。'.format(skin.getAttribute('skinName')));
                }
                else {
                    $.alert(result.msg)
                }
            })
        },
        buildSkinList: function (skins) {
            var userContent = $.box.getUserContext(null, false) || { skin: "" };
            skins.each(function (skin) {
                skins[skin.dir] = skin;
            })

            var html = skins.select(function (skin) {
                return '<div id="skin-{dir}" class="skin-item {0}" skin="{dir}" skinName="{name}"><img src="../themes/skins/{dir}/ico.png"/><div>{name}</div></div>'.format((userContent.skin || {}).name == skin.dir ? "current" : "", skin)
            }).join('')
            this.contentBlock.append(html);
            this.contentBlock.$('.skin-item').click(function () {
                if (page.currentSkin == this) {
                    return;
                }
                if (page.currentSkin)
                    $(page.currentSkin).removeClass('current')
                page.currentSkin = this;
                $(this).addClass('current');

                var win = window;
                do {
                    win.fly.box.setSkin(skins[this.getAttribute('skin')])
                    if (win == win.parent)
                        break;
                    win = win.parent;
                } while (win)
                page.save();
            })
            page.currentSkin = this.contentBlock.$(".current")[0];
        },
        loadSkins: function () {
            $.post($.box.ajaxUrl('skin', 'skins'), function (result) {
                if (result.success) {
                    page.buildSkinList(result.data)
                }
                else {
                    $.alert(result.msg);
                }
            })
        },
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            this.loadSkins()
        }
    });

    $.doc.addClass('setting-skin');
    $.Style.loadCss('../themes/box-default/setting.css?'+$.pathPart);
    window.page = new $.box.Skin()
    page.show();
} ()