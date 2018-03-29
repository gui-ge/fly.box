fly.regPlugin(function ($, win) {
    var ui = $.ui;
    if (ui.Pager) {
        var p = ui.Pager.prototype;
        p.infoFormat = "<span class=gray >显示 {start+1}-{end+1} 条，共 {total} 条</span>"
        ui.Pager.buttonNames = { first: "第一页", previous: "上一页", next: "下一页", last: "最后一页", refresh: "刷新" }

        var iItems = ui.Pager.currentTypeBuilder.input.items;
        iItems[3].text = "  第  "
        iItems[5] = "<span class=gray > &nbsp;页，共 <span class=f-pager-pageCount ></span> 页</span> &nbsp;"

    }
});