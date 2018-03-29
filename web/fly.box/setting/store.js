/// <reference path="../common/form-base.js" />
!function ($) {
    var $ = fly
    $.box.StoreForm = $.Class({
        name: '存储',
        title: '存储设备管理',
        base: $.box.FormBase,
        buttons: ['save', '<a onclick="page.begoreEditStore()">取消</a>', '<a id=delete-button onclick="page.remove()" style="margin-left:60px;margin-right:50px">删除</a>'],
        pageFormat: [parent.isSettingPage ? '' : '<div id=top-empty></div><div id="title-block">{title}</div>', '<form id="content-block" method="post"></form>',
                    '<div id=add-button-div ><a class=a-button href=# onclick="page.addStore();return false">添加存储设备</a><div>',
                    '<div id="toolbar" class=button-32  ></div>'].join(''),
        createForm: function () {
            this.$base.createForm.apply(this, arguments);
            this.treeContainer = $("#tree-container");
            this.treeContainer.insertBefore(this.contentBlock);
            this.contentBlock.append(this.toolbar)

            $.common.createTree({
                async: { url: $.box.ajaxUrl('store', 'pagedata') },
                onRequestData: function (node, result) {
                    result.data.each(function (store) {
                        store.id = store.Id;
                        store.text = '<span class=size >{IsDisabled?"<font color=red >已禁用</font> ":""}{$.sizeFormat(Size)}</span><span class=used >{$.sizeFormat(Used)}</span><span class=path >{Path}</span>'.format(store)
                    });
                    return result.data;
                },
                onSelect: function (node) {
                    page.begoreEditStore(node.selected ? node : null);
                }
            }, function (tree) {
                page.storeTree = tree
                tree.render(page.treeContainer[0]);
            })
        },
        begoreEditStore: function (store) {
            this.editingStore = store;
            $('#add-button-div').show(store == null)

            if (store == null) {
                this.contentBlock.hide();
            }
            else {
                this.contentBlock.show();
                this.form[0].size.value = ((store.Size || 0) / 1073741824).toFixed(1);
                this.form[0].path.value = store.Path || ''
                this.form[0].isDisabled.checked = store.IsDisabled
            }
        },
        addStore: function () {
            this.begoreEditStore({ isAdd: true, Size: 100 * 1073741824 });
        },
        save: function () {
            var values = this.getSubmitValues()
            if (!values)
                return;

            var store = this.editingStore
            var newSize;
            if (!store.isAdd) {
                var newSize = ((store.Size || 0) / 1073741824).toFixed(1)
                if (newSize == values.size && store.Path == values.path && store.IsDisabled == (values.isDisabled == 'on')) {
                    this.begoreEditStore()
                    return;
                }
                values.id = store.Id
            }

            $('#delete-button').show(!store.isAdd)

            if (newSize == values.size)
                values.size = -1;
            else
                values.size = parseInt((Number(values.size) * 1073741824));

            $.post($.box.ajaxUrl('store', 'save'), values, function (result) {
                result.msg && $.alert(result.msg);
                if (result.success)
                    window.location.href += '';
            }, $.common.onAjaxErr);
        },
        remove: function () {
            var store = this.editingStore
            function del() {
                $.post($.box.ajaxUrl('store', 'delete'), { id: store.Id }, function (result) {
                    if (result.success) {
                        $.alert('存储设备“{Path}”已删除。'.format(store), function () {
                            window.location.href += ''
                        })
                    }
                    else {
                        $.alert(result.msg)
                    }
                })
            }

            if (store.Used) {
                $.alert('存储设备已经被使用，已存储{0}数据，不能删除。'.format($.sizeFormat(store.Used)))
                return;
            }

            del()
        }
    });

    $.doc.addClass('setting-store');
    $.Style.loadCss('../themes/box-default/setting.css?' + $.pathPart);
    window.page = new $.box.StoreForm()
    page.show();
} ()