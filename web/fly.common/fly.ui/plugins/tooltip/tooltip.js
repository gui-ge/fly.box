/// <reference path="../../../fly/fly.js" />,
/// <reference path="../../fly.ui.js" />

fly.regPlugin('tooltip', function ($) {
    var ui = $.ui, $e = $.Event;
    ui.Tooltip = $.Class({
        base: ui.Panel,
        baseCss: "f-tooltip",
        domFrame: { el: ['arrow',"body"] },
        arrowFormat: '<div class="{baseCss}-arrow"></div>',
        constructor: function () {
            arguments.callee.$base.apply(this, arguments)
            this.onRender(this.applyPosition)
        },
        applyPosition: function () {
            this.box = $(this.box)
            var pos = this.box.rect(), size = this.outer.offset(), docOffset = $.doc.offset(), arrowSize = this.arrow.offset()
            var css = this.baseCss + 'arrow-bottom', top = pos.top + pos.height + arrowSize.height - 4
            if (top + size.height > docOffset.height) {
                top = pos.top - size.height - arrowSize.height + 4
                css = this.baseCss + 'arrow-above'
            }

            var left = pos.left;
            if (pos.width > size.width)
                left += (pos.width - size.width) / 2
            if (left + size.width > docOffset.width)
                left -= docOffset.width - left - size.width

            this.outer.css({ left: left, top: top })
            this.outer.addClass(css)
        }
    });

    ui.Tooltip.show = function (box, text, config) {
        var box = $(box)
        if (text == null || text == "")
            text = box.attr("tooltip")
        var tt = new ui.Tooltip($.extend({ box: box, text: text },config))
        tt.show()
        var hide = function () {
            tt.destroy && tt.destroy()
            box.un("blur", hide)
        }

        box.blur(hide)
        return tt;
    }
})