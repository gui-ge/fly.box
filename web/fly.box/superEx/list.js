/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    var pageHtml = ['<div id=top-empty></div>',
                    parent.isSettingPage ? '' : '<div id="title-block">{title}</div>',
                    '<div id="toolbar" class="nolink"></div> ',
                    '<div id="list-container" class="nolink a-button">',
                    '</div>'].join('')
    $.box.SuperExList = $.Class({
        name: "超级扩展",
        base: $.base.ListBase,
        pageFormat: pageHtml,
        buttons: ['add'],
        pageUrl: $.base.ajaxUrl($.box.pageContext.module, 'PageData'),
        gridConfig: function () {
            return {
                columns: [{
                    dataIndex: 'Order', header: '序号'
                }, {
                    format: '{Time.format($.box.dt2Format)}',
                    dataIndex: 'Time',
                    header: '修改时间'
                }, {
                    dataIndex: 'User',
                    header: '创建人'
                }, {
                    dataIndex: 'Remark',
                    header: '备注'
                }, {
                    header:'',
                    dataIndex:'Enable',
                    format: '{Enable?"启用":"禁用"}'
                },{
                    renderer: this.commandColRenderer()
                }]
            }
        }
    });
    window.page = new $.box.SuperExList()
    page.show();
} ()