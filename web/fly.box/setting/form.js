/// <reference path="../common/form-base.js" />
!function ($) {
    window.isSettingPage = true;
    var $ = fly, current = $.getQuery('current') || 'skin';
    $.box.pageContext.current = current;
    if ($.box.isWithOrg)
        $.loadScript('http://flyui.net/fly.box/version.php?cmd=client-check&v=' + $.pathPart + '&' + new Date().format('yyyy-MM-dd'));

    $.post($.box.ajaxUrl('setting', 'settingInit'), function (result) {
        var tabs = [{ form: 'skin', name: '个性皮肤'}];

        var context = $.box.getUserContext();
        if ($.box.isWithOrg) {
            tabs.addRange([{ form: 'store', name: '存储设备管理' },

                (result.data.allotByRole ? { list: 'roleSpace', name: '用户组空间分配', module: 'space'} : { list: 'userSpace', name: '个人空间分配', module: 'space' }),

                { list: 'orgSpace', name: '单位空间分配', module: 'space' },
                { list: 'list', name: '超级扩展', module: 'superEx' },
                { form: 'app-setting', name: 'APP设置' },
                { form: 'other', name: '其它' }
                ]);
        }

        tabs.insert(tabs.length - 2, { url: '../setting/personal.htm', name: '个人设置' });

        var tabsHtml = tabs.select(function () {
            if (this.url)
                return '<a id=tab-{form} class="tab" rel="{url}" target=setting-frame >{name}</a>'.format(this);
            else if (this.form)
                return '<a id=tab-{form} class="tab" rel="form.htm?m={o.module||"setting"}&form={form}" target=setting-frame >{name}</a>'.format(this);
            else if (this.list)
                return '<a id=tab-{list} class="tab" rel="list.htm?m={o.module||"setting"}&list={list}" target=setting-frame >{name}</a>'.format(this);
        }).join('')

        var title = '<div class="tab-panel nolink">{0}</div>'.format(tabsHtml)
        $.box.Setting = $.Class({
            name: '设置',
            current: current,
            title: title,
            base: $.base.FormBase,
            formUrl: null,
            pageFormat: ['<div id=top-empty></div><div id="title-block">{title}</div>',
                    '<div id=setting-content ><iframe name=setting-frame frameBorder=no allowTransparency=1></iframe></div>'].join(''),
            createBody: $.box.FormBase.prototype.createBody.after(function () {
                var frame = document.getElementsByTagName('iframe')[0]
                $.getBody().addClass(page.current);
                this.tabs = this.titleBlock.$('a');
                var previous;
                function setCurrent() {
                    if (previous == this)
                        return;
                    if (previous)
                        $(previous).removeClass('current')
                    previous = this
                    $(previous).addClass('current')
                    var src = this.rel;
                    if ($.box.isWithOrg)
                        src = $.appendQuery('$with-org', 1, src)
                    frame.src = src
                }
                this.tabs.click(setCurrent)
                setTimeout(function () {
                    setCurrent.call($('#tab-' + current)[0])
                })
            })
        });
        $.doc.addClass('setting-index')
        $.Style.loadCss('../themes/base-default/tab.css?' + $.pathPart);
        $.Style.loadCss('../themes/box-default/setting.css?' + $.pathPart);
        $.box.createPage(function () {
            return new $.box.Setting()
        })
        page.show();
    });
} ()