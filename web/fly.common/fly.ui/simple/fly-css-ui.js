/// <reference path="../../fly/fly.js" />

!function () {
    var $ = fly;
    $.ui.Menu = $.Class({
        openCss: 'f-open',
        toggleButtonCss: 'f-menu-toggle',
        constructor: function (config) {
            config && $.extend(this, config);
            this.createMembers()
            this.bindEvents()
        },
        createMembers: function () {
            this.el = $(this.el);
            this.container = $(this.container || this.el.parent());
            this.toggleButton = $(this.toggleButton)
            if (!this.toggleButton.length)
                this.toggleButton = this.container.$('.' + this.toggleButtonCss)
        },
        toggle: function () {
            this.container.toggleClass(this.openCss);
        },
        hide: function () {
            this.container.removeClass(this.openCss);
        },
        show: function (pos) {
            this.container.addClass(this.openCss);
            if (pos == "mouse") {
                var el = this.el;
                var elRect = el.rect();

                var pos = { left: $event.pageX || $event.clientX || 0, top: $event.pageY || $event.clientY || 0 }
                if (pos.top + elRect.height > document.documentElement.offsetHeight)
                    pos.top -= elRect.height
                if (pos.left + elRect.width > document.documentElement.offsetWidth)
                    pos.left -= elRect.width
                el.css(pos);
            }
        },
        bindEvents: function () {
            this.toggleButton.click(this.toggle, this)
            this.el.on('out_mousedown', this.hide, this);
            this.el.mouseup(this.hide, this);
        }
    })

    $.ui.Menu.applyAll = function (selecter) {
        $(selecter || '.f-menu').each(function () {
            this.flyMenu = new $.ui.Menu({ el: this })
        })
    }

    $.ui.NavBar = $.Class({
        selectedCss: 'f-selected',
        itemsSelection: 'li',
        constructor: function (config) {
            config && $.extend(this, config);
            this.createMembers()
            this.bindEvents()
        },
        createMembers: function () {
            this.el = $(this.el);
            if (this.itemsSelection && !this.items)
                this.items = this.el.$(this.itemsSelection);
        },
        selectItem: function (item) {
            if (this.selectedItem == item)
                return;
            if (this.selectedItem)
                $(this.selectedItem).removeClass(this.selectedCss);
            $(item).addClass(this.selectedCss);
            this.selectedItem = item;
            this.fire('selectitem', item);
        },
        bindEvents: function () {
            this.el.click(function (el, evt) {
                var item = $(evt.target).closest(this.itemsSelection);
                if (item[0]) {
                    this.selectItem(item[0]);
                }
            }, this)
        }
    });
} ()