﻿!function () { var _ = fly; window.needLogin = false; _.box.Player = _.Class({ constructor: function () { this.createMembers() }, mediaType: _.getQuery("media-type"), media: { name: _.getQuery("name"), url: _.getQuery("url") }, buildList: function () { var _ = setInterval(function () { var A = parent.page.files; if (A) { clearInterval(_); var C, B = A.select(function (_) { var A = _.name.replace(/\.(avi|mpg|wmv)$/i, function ($) { return $ + ".flv" }), D = "../../fly.box/o.ashx/id-" + _.id + (parent.page.shareCode ? "~c-" + parent.page.shareCode : "") + "?" + A, B = "<m label=\"{0}\" src=\"{1}\" />".format(_.name, D); if ($.media.url.contains(_.id)) { C = B; return "" } return B }).join(""); $.cmpo.list_xml("<list>{0}</list>".format(C)); $.cmpo.sendEvent("view_play"); if (B) $.cmpo.list_xml("<list>{0}</list>".format(B), true) } }, 30) }, itemLoad: function () { var $ = 0, _ = this.cmpo.item("url"); parent.page.files.each(function (A, B) { if (_.contains(A.id)) $ = B }); parent.page.setCurrent($, false) }, createCmp: function () { var _ = this; window.cmp_loaded = function (A) { var $ = _.cmpo = CMP.get("cmp"); window.model_load = _.itemLoad.bind(_); $.addEventListener("model_load", "model_load"); setTimeout(function () { _.buildList() }) }; var $ = { api: "cmp_loaded", skin: this.mediaType == "audio" ? "skins/mp3player1.zip" : "skins/webplayer.zip" }, A = CMP.create("cmp", "100%", "100%", "../../fly.common/cmp/cmp.swf", $, { wmode: "transparent" }); document.getElementById("player").innerHTML = A }, createMembers: function () { _.doc.addClass("m-" + this.mediaType); this.createCmp(); parent.page.playPrev = function () { page.cmpo.sendEvent("control_prev") }; parent.page.playNext = function () { page.cmpo.sendEvent("control_next") } } }); var $ = page = new _.box.Player() } ()