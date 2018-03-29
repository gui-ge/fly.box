/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    fly.box.SMSOutboxList = $.Class({
        name: "短信",
        base: $.box.ListBase,
        buttons: ['<a href="form.htm?m=sms&form=edit" >发送短信</a>'],
        commandColButtons: ['<a class="btn-16 btn-re-send" title=转发 href="form.htm?m=sms&form=edit&id={Id}&cmd=re-send" ></a>'],
        pageUrl: $.box.ajaxUrl('sms', 'OutboxList'),
        createGrid: function () {
            this.$base.createGrid.call(this, {
                columns: [{
                    dataIndex: "NumbersDesc",
                    header: "接收号码"
                }, {
                    dataIndex: "Content",
                    header: "短信内容"
                }, {
                    dataIndex: "CreateTime",
                    header: "时间",
                    renderer: function (v) {
                        return v.format('MM-dd HH:mm');
                    }
                }, {
                    dataIndex: 'Result',
                    header: '状态',
                    renderer: function (v, cell) {
                        if (v) {
                            if (v.startWith('1.')) {
                                return '<span class=f-ok-color >已发送 {0}</span>'.format(cell.record.SendTime.format('MM-dd HH:mm'))
                            }
                            else
                                return '<span class=f-error-color >发送失败 {0}  {1}</span>'.format(cell.record.SendTime.format('MM-dd HH:mm'), v)
                        }
                        return '<span class=f-gray-color >{0}</span>'.format(cell.record.SubmitTime ? cell.record.SubmitTime.format('MM-dd HH:mm 已提交') : '未提交');
                    }
                }, {
                    width:40,
                    renderer: this.commandColRenderer()
                }]
            });
        }
    });
    window.page = $.base.createPage("fly.box.SMSOutboxList")
    page.show();
} ()