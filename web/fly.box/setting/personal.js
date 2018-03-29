/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly
    var frame = document.getElementsByTagName("iframe")[0];
    $.box.Personal = $.Class({
        createMembers: function () {
            this.menus = $("#page-left-block li a");
            this.menus.each('a=>a.target || (a.target="personal")');
        },
        show: function () {
            this.createMembers();
            var curr = $.getQuery("current")
            if (curr) {
                var href = $("#" + curr).attr("href");
            }
            if (!href) {
                href = this.menus.first$().attr("href");
            }

            $(frame).attr('src', href);
        }
    });

    $.box.createPage(function () {
        return new $.box.Personal()
    });
    setTimeout(function () {
        page.show();
    }, 200)

    
    var dHeight = 50;
    setInterval(function () {
        var doc = frame.contentWindow.document;
        if (!doc)
            return;
        var height = Math.max(doc.documentElement.clientHeight, doc.documentElement.offsetHeight, doc.documentElement.scrollHeight);
        if (doc.body)
            height = Math.max(height, doc.body.clientHeight, doc.body.offsetHeight, doc.body.scrollHeight);
        frame.style.height = (height + dHeight) + "px";
        dHeight = 0;
        if (doc.title) {
            document.title = doc.title;
        }
    }, 500)
} ()