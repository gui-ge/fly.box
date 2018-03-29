/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.base.UserForm = $.Class({
        name: '用户',
        base: $.base.FormBase,
        createForm: function () {
            debugger;
            this.$base.createForm.apply(this, arguments);
            this.departmentCombo = $.common.createComboTree({
                wrap: this.form[0].DepartmentName.parentNode,
                tree: {
                    root: {
                        id: ''
                    },
                    async: {method:'post', url: $.base.ajaxUrl('department', "childrenTree", "parentId={id}") }
                }
            });
        }
    });
    window.page = new fly.base.UserForm()
    page.show();
} ()