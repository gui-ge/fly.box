/// <reference path="../../../fly.common/fly/fly.js" />
/// <reference path="../../../fly.common/fly.mini/fly.mini-all.js" />
!function () {
    var $ = fly;
    window.indexPath = '../'
    var withOrg = $.getQuery('$with-org') == '1'
    fly.mini.ajax = $.ajax;

    var fs;
    $.box.FileSelect = $.Class({
        constructor: function () {
            fs = this
            this.createMembers();
        },
        without: $.getQuery('without') || '',
        expandId: $.getQuery('expand') || '',
        includeOrgSpace: $.getQuery('include-org-space') || '',
        includeMySpace: $.getQuery('include-my-space') || '',
        createMembers: function () {
            this.createTree()
            window.getSelection = this.getSelection;
            frameElement && (frameElement.getSelection = this.getSelection);
        },
        getSelection: function () {
            var tree = fs.tree;
            return tree.getSelectItems();
        },
        onSelectComplete: function (item, el, evt) {
            window.onSelectComplete && onSelectComplete(item);
            window.frameElement && frameElement.onSelectComplete && frameElement.onSelectComplete(item);
        },
        newFolderEditorFormat: '<form id=new-folder onsubmit="selector.createFolderSave();return false" ><input id=new-folder-input /><a id=new-folder-save onclick="selector.createFolderSave()" ></a> <a id=new-folder-cancel onclick="selector.createFolderCancel()" ></a> </form>',
        createFolderSave: function () {
            var newName = $('#new-folder-input').val();
            if (!newName) {
                $.alert('请输入名称！');
                return false
            }

            $.post({
                loading: {
                    css: 'f-loading',
                    box: document.body
                },
                url: $.box.ajaxUrl('Folder', 'Create'),
                data: { parentId: this.newFolderParent.id, name: newName, space: this.newFolderParent.space },
                success: function (result) {
                    if (result.success) {
                        result.data.iconCss = 'item-folder',
                        result.data.nodeId = result.data.id
                        result.data.text = result.data.name
                        result.data.leaf = true;

                        selector.newFolderParent.addItem([result.data]);
                        selector.createFolderCancel();
                        selector.newFolderParent.items.last().select(true,true);
                    }
                    else
                        $.alert(result.msg)
                },
                onError: $.onAjaxErr
            })
        },
        createFolderCancel: function () {
            $('#new-folder').remove();
        },
        createFolder: function () {
            var parent = this.getSelection()[0];
            if (!parent)
                return alert('请选择上级文件夹。');

            $('#new-folder').remove();
            this.newFolderParent = parent;
            $(parent.wrap).append(this.newFolderEditorFormat);
            setTimeout(function () {
                $('#new-folder-input').focus();
            })
        },
        createTree: function () {
            var parentId = $.getQuery('parentId');
            var items = [];
            if (parentId) {
                items.push({
                    id: $.getQuery('parentId'),
                    text: decodeURI($.getQuery('parentName') || $lang.diskName),
                    iconCss: 'item-folder-root',
                    expanded: 1,
                    leaf: false
                });
            }
            else {
                if (this.includeOrgSpace == 1 || withOrg)
                    items.push({
                        id: '',
                        space: 'org',
                        text: $lang.diskFullName,
                        iconCss: 'item-folder-root',
                        expanded: withOrg ? 1 : 0,
                        leaf: false
                    });

                if (this.includeMySpace == 1 || !withOrg)
                    items.push({
                        id: '',
                        space: 'my',
                        text: $lang.mySpaceName,
                        iconCss: 'item-folder-root',
                        expanded: withOrg ? 0 : 1,
                        leaf: false
                    });
            }


            this.tree = new fly.mini.Tree({
                container: document.body,
                //root: parent,
                items: items,
                itemEvents: {
                    panel: {
                        dblclick: fs.onSelectComplete
                    }
                },
                async: {
                    url: $.box.ajaxUrl('SpaceFile', 'ForSelect', "parentId={id}&space={space}&type=Folder&without=" + this.without + '&expand=' + this.expandId + "&include-org-space=" + this.includeOrgSpace + "&include-my-space=" + this.includeMySpace),
                    method: "post"
                },
                // textDomFormat: '{iconDomHtml}<a name="textDom" class=f-m-item-text >{text}</a>',
                onRequestData: function (item, result) {
                    if (!result || !result.success)
                        return null;

                    for (var i = 0; i < result.data.length; i++) {
                        var n = result.data[i];
                        n.text = n.name;
                        n.iconCss = 'item-folder',
                        n.nodeId = n.id
                    }
                    return result.data
                }
            });
        }
    })
} ()