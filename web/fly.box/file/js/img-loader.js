/// <reference path="../../common/common.js" />
!function () {
    var $ = fly;

    $.box.Player = $.Class({
        constructor: function () {
            this.createMembers()
        },
        img: {
            name: $.getQuery('name'),
            url: $.getQuery('url')
        },
        onImgLoaded: function () {
            $.doc.addClass('img-loaded');
            var height = this.imgDom[0].height;
            if (height < document.body.clientHeight - 10) {
                this.imgDom.top(((document.body.clientHeight - height) / 2) + "px")
            }
        },
        onImgError: function () {
            location.href = this.img.url;
        },
        createMembers: function () {
            this.imgDom = $('#img');
            this.imgDom.on("load", this.onImgLoaded.bind(this))
            this.imgDom.on("error", this.onImgError.bind(this));
            this.imgDom[0].src = this.img.url;
        }
    })
    var flyPlayer = page = new $.box.Player()
} ()