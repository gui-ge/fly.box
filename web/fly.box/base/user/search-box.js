/// <reference path="../../common/common.js" />
!function () {
    var $ = fly;

    $.box.UserSearchBox = $.Class({
        constructor:function(opt){
            var me=this;
            $.extend(this,opt);
            this.input=$(this.input);
            this.input.keydown(this.queryUser.bind(this));
            this.input.click(function () {
                if (me.userListBox && me.userListBox[0].options.length > 0) {
                    setTimeout(function () {
                        me.userListBox.show();
                    }, 100);
                }
            })
        },
        queryUser: function () {
            clearTimeout(this.searchHandler)
            var me=this;
            this.searchHandler = setTimeout(function () {
                var key = me.input.value().trim();
                if (key != me.previousSearchKey) {
                    if (key) {
                        $.post($.box.ajaxUrl("base", "Search"), { type: 'user', key: key }, function (result) {
                            me.showSearchResult(result.data);
                        })
                    }
                    else {
                        me.showSearchResult([]);
                    }
                    me.previousSearchKey = key;
                }
            }, 1000)
        },
        showSearchResult: function (items) {
            var me=this;
            if (!this.userListBox) {
                this.userListBox = $('<select onfocus="this.blur()"></select>')
                this.input.after(this.userListBox);
                this.userListBox.click(function () {
                    var op = this.options[this.selectedIndex];
                    me.input.val(op.text)
                    me.input[0].selectedValue=me.selectedValue = op.value;
                    me.input[0].selectedText =me.selectedText = op.text;
                    me.onChange && me.onChange(op);
                    me.userListBox.hide();
                })
                this.userListBox.on("out_click", function () {
                    me.userListBox.hide();
                })
            }
            this.userListBox[0].options.length = 0;
            if (items.length == 0) {
                this.userListBox.hide();
                return;
            }
            this.userListBox.show();

            $.each(items, function (item) {
                me.userListBox[0].options.add(new Option(item.name, item.id))
            })
            this.userListBox[0].size = Math.max(2, items.length);
        }
    })
} ();