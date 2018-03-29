/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly;
    fly.base.OrgForm = $.Class({
        name: '单位',
        base: $.base.FormBase,

        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            if (this.model && !this.model.ParentId) {
                $('#parentField').remove();
            }
            else {
                this.parentCombo = $.common.createComboTree({
                    wrap: this.form[0].ParentName.parentNode,
                    tree: {
                        root: {
                            id: userContext.org.id,
                            text: userContext.org.name
                        },
                        async: { url: $.base.ajaxUrl(this.module, "childOrgTree", "parentID={id}&exceptIDs=" + this.modelId) }
                    }
                });

                if (this.isAdd) {
                    this.form[0].ParentId.value = userContext.org.id
                    this.form[0].ParentName.value = userContext.org.name
                }
            }
        }
    });

    window.page = new fly.base.OrgForm()
    page.show();
} ()