fly.regPlugin("listview", function ($) {
    var ui = $.ui, $e = $.Event, $c = $.collection, dh = ui.DomHelper
    function ListView(config) {
        config && $.extend(this, config);
        this.container && (this.container = $(this.container));
    }

    /*	#C path:fly.ui.ListView
    通过网格形式在客户端浏览数据，可以配合分页控件使用
    @base   :fly.ui.Panel
    @config :JSON 初始化配置
    */
    ui.ListView = new $.Class(
    {
        constructor: ListView,
        nodeSelector: '.f-lv-node',
        container: null,
        nodeTemplate: '<li class=f-lv-node >{node.text}</li>',
        buildNodes: function () {
            this.nodes = this.container.$(this.nodeSelector);
        },
        onBindRecords: $.Event.createEventFn('afterBindRecords'),
        bindRecords: function (records, idProp) {
            var temp = '{@for o as node}\n' + this.nodeTemplate + '\n{for@}';
            var html = temp.format(records);
            this.container.empty();
            this.container.html(html);
            this.buildNodes(records);
            this.fire('afterBindRecords');
        }
    });

});