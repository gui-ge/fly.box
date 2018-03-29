/// <reference path="../../../fly/fly.js" />
/// <reference path="../../fly.ui.js" />

fly.regPlugin('formstyle',function ($) {
    var $f = $.plugins.formStyle = function (config) {
        $.extend(this, config);
        this.init()
    }

    $f.extend(
    {
        toggleAble: false,
        init: function () {
            this.container = $(this.container || "form");

            if (this.toggleAble) {
                this.toggleButtons = this.container.$(".f-f-block-toggle")
                this.toggleButtons.click(this.toggleBlock);
                this.toggleButtons.parent().dblclick(this.toggleBlock)
            }
        },
        toggleBlock: function () {
            var tr = $(this).closest("tr");
            if (tr.length) {
                $.DomHelper.unSelection();
                var block = tr.parent();
                var collapsed = block.hasClass("f-f-block-collapse")
                block[collapsed ? "removeClass" : "addClass"]("f-f-block-collapse")
                tr.css("display", $.browser.isIE ? "block" : "table-row");

            }
        }
    });
})