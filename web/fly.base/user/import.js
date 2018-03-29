/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.base.ImportUser = $.Class({
        base: $.base.FormBase,
        title: '批量导入用户',
        needUpload: true,
        saveUrl: $.base.ajaxUrl('user', 'import'),
        ajaxOption: { dataType: 'json' },
        pageFormat: ['<form id="content-block" method="post" enctype="multipart/form-data"></form>', '<div id="toolbar" class=button-32  ></div>', '<div id=show-msg-box ></div>'].join(''),
        buttons: ['<a id="btn-save" onclick="page.save()">导入</a>', 'cancel'],
        isAdd: false,
        getModelUrl: $.base.ajaxUrl('user', 'getRoleInfos', 'ids=' + $.base.pageContext.ids),
        validate: function () {
            var file = $('#user-file').val();
            if (!file) {
                alert('请选择包含用户数据的Excel文件。');
                return false
            }

            if (!file.toLowerCase().contains('.xls')) {
                alert('文件格式错误，只支持从Excel文件导入 ，请选择包含用户数据的Excel文件。');
                return false
            }
            return true;
        },
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            this.contentBlock.border("0px")
        },
        saveSuccess: function (result) {
            if (result.msg)
                alert(result.msg);
            else if (!result.success) {
                alert('用户导入失败');
            }

            if (result.data) {
                var html = result.data.select(function (row,index) {
                    return "<tr><td>{0}. {1}</td><td>:</td><td class=error-data >{2}</td></tr>".format(index + 1, row.msg, row.row.join(','));
                }).join('');
                html = "<div  style='color:red;margin:20px;border:1px solid #ddd;border-radius:5px;padding:10px;'><table><tr><td colspan=3 ><b><a name=msg >导入失败用户如下，请适当修改数据重新导入：</a></b></td></tr>{0}</table></div>".format(html);
                $('#show-msg-box').html(html);
                window.open('#msg','_self');
            }
            else {
                $('#show-msg-box').html('');
            }
        }
    });

    window.page = new fly.base.ImportUser()
    page.show();
} ()