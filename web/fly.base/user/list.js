/// <reference path="../common/list-base.js" />
!function () {
    var $ = fly;
    fly.base.UserList = $.Class({
        name: '用户',
        base: $.base.ListBase,
        buttons: ['add', 'edit', '<a id="btn-set-role" href="#">用户组</a>',
        'remove',
        '<a id="btn-import" href="form.htm?m=user&form=import">批量导入</a>',
        '<span style="float:right">' +
            '<select id=combo-type><option value=all >用户类型</option><option value=register >注册用户</option><option value=manager >管理员</option><option value=waitAudit >未审核</option><option value=auditPass >审核通过</option><option value=auditNotPass >审核未通过</option></select>' +
            '<select id=combo-verify><option value=all >验证</option><option value=yes >邮箱已验证</option><option value=no >邮箱未验证</option></select> ' +
        '</span>'
        ],
        pageFormat: ['<div id=top-empty></div><div id="title-block">{title}</div>',
                    '<div id="toolbar" class="nolink"></div> ',
                    '<div id=left-container ></div>',
                    '<div id="list-container" class="nolink a-button"><div class=list-loading ></div></div>'
                    ].join(''),
        createGrid: function () {
            this.$base.createGrid.call(this, {
                columns: [$.common.createSelection(), {
                    dataIndex: "LoginName",
                    header: "登录名"
                }, {
                    dataIndex: "NickName",
                    header: "名字"
                }, {
                    dataIndex: 'Sex',
                    header: '性别'
                }, {
                    dataIndex: 'Dept',
                    header: '部门'
                }, {
                    dataIndex: "MobilePhone",
                    header: "手机"
                }, {
                    dataIndex: "Email",
                    header: "邮箱"
                }, {
                    renderer: this.commandColRenderer()
                }]
            });
        },
        createMembers: function () {
            this.commandColButtons.push('<a href="form.htm?m=user&form=audit&id={Id}" class="btn-16 btn-audit" title="审核"></a>');
            this.$base.createMembers.call(this);
            this.btnSetRole = $('#btn-set-role')
            this.comboType = $("#combo-type");
            this.comboVerify = $("#combo-verify");
            this.createTree();
        },
        createTree: function () {
            $.common.createTree({
                container: 'left-container',
                root: {
                    id: '',
                    text: userContext.org.name
                },
                async: { url: $.base.ajaxUrl('department', "childrenTree", "parentID={id}") },
                selectionMode: fly.mini.selectionMode.single,
                onSelect: function (node, fireBy) {
                    if (fireBy) {
                        parent.contentPageTreeSelectedId = page.store.params.departmentId = node.selected ? node.id : null;
                        page.pager.go(1, true);
                    }
                }
            });
        },
        initEvents: function () {
            var me = this;
            this.$base.initEvents.call(this);
            this.btnSetRole.click(function () {
                var ids = me.grid.getSelectionIds($.base.lang.noSelected.format("分配组", "用户"))
                if (ids.length)
                    location.href = "form.htm?m=user&form=set-role&ids=" + ids.join(',')
                return false;
            });

            this.comboType.change(function () {
                me.store.params.UserType = this.value;
                me.pager.go(1, true);
            });

            this.comboVerify.change(function () {
                me.store.params.Verified = this.value;
                me.pager.go(1, true);
            });
        }
    });

    window.page = new fly.base.UserList()
    page.show();

} ()