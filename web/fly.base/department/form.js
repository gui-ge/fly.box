/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.base.DepartmentForm = $.Class({
        name: '部门',
        base: $.base.FormBase,
        createForm: function () {
            var me = this;
            this.$base.createForm.apply(this, arguments);
            debugger
            $.common.createComboTree({
                wrap: this.form[0].ParentName.parentNode,
                tree: {
                    root: {
                        id: '',
                        text: userContext.org.name
                    },
                    async: { url: $.base.ajaxUrl(this.module, "childrenTree", "parentID={id}&exceptIDs=" + this.modelId) }
                }
            }, function (combo) {
                page.parentCombo = combo;
            });

            if (!this.isAdd) {
                this.managerUser = $.common.createComboTree({
                    wrap: this.form[0].ManagerName.parentNode,
                    tree: {
                        root0: {
                            id: '',
                            text: userContext.org.name
                        },
                        async: { url: $.base.ajaxUrl(this.module, "UserList", "departmentId=" + page.modelId) }
                    }
                });
            }

            //新增或直属部门
            if (this.isAdd || !this.model.ParentId) {
                this.form[0].ParentName.value = userContext.org.name
            }
        }
    });
    window.page = new fly.base.DepartmentForm()
    page.show();
} ()