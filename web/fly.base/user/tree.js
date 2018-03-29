/// <reference path="../../common/common.js" />
window.indexPath = "../";
!function () {
    var $ = fly;
    fly.mini.ajax = $.ajax;
    var hasParent = !!window.frameElement
    var isAsync = $.getQuery('async') != "0";
    var treeContainer = $("#tree-container");
    var tree = new fly.mini.Tree({
        container: treeContainer[0],
        selectionMode: fly.mini.selectionMode.none,
        checkMode: fly.mini.checkMode.multi,
        checkCascade: {
            check: { parent: 0, children: true },
            uncheck: { parent: 0, children: true }
        },
        autoScroll: true,
        showBorder: false,
        itemKey: "id",
        navTarget: "iframe",
        //toggleEvents: { panel: 'click' },
        itemEvents:{
            panel:{click:function(item){
                if(item.leaf){
                    item.toggleCheck();
                }
                else{
                    item.toggle();
                }
            }}
        },
        onCheck: function (item, fireByDom) {
            if (hasParent && frameElement.onCheck)
                frameElement.onCheck(item, fireByDom);
        },
        onExpand: function (item) {
            if (hasParent && frameElement.onExpand)
                frameElement.onExpand(item);
        },
        onJoin: function (item) {
            item.text = item.name + (item.phone ? "-" + item.phone : '') + (item.orgName ? "-" + item.orgName : '');
            item.iconCss = "tree-node-" + item.type
            item.leaf = item.type == "user" || item.type == "search";
        },
        onRequestData: function (item, result) {
            if (hasParent && frameElement.onRequestData)
                frameElement.onRequestData(item, result);
            if (!result.success)
                return [];

            if (result.userCount)
                result.data[0].name += "(" + result.userCount + ')'
            if (!isAsync && result.data[0])
                result.data[0].expanded = true
            return result.data
        },
        async: {
            url: $.base.ajaxUrl("user", isAsync ? "UserTree" : "AllUserTree", "id={id}&type={type}"),
            data: { role: $.getQuery("roleName") },
            method: "post"
        }
    });

    var searchNode = null;
    function createSearchNode() {
        if (searchNode)
            return;
        searchNode = tree.root.insertItem(0, { name: '搜索结果', type: 'search', leaf: true, iconCss: 'tree-node-search' })[0];
        searchNode.wrap.title = "Tab、Enter选中第一个搜索结构，可用上下键选择其他，还可以配合Shift多选哦。";
    }

    function showSearchResult(items) {
        createSearchNode()
        searchNode.removeItem(searchNode.items)
        searchNode.currentIndex = -1;
        searchNode.addItem(items);
        if (items.length)
            searchNode.expand();
        searchNode.setText("搜索结果({0})".format(items.length));
    }

    if ($.getQuery("supper-search") == "1") {
        var searchBox = $('<input id=search-box class=search-input />');
        $.getBody().prepend(searchBox);

        new fly.ui.EmptyBox({ input: searchBox, emptyValue: "搜索：姓名、手机、登录名、邮箱" });
        var previousSearchKey = "";
        searchBox.keydown(function () {
            clearTimeout(this.searchHandler)
            this.searchHandler = setTimeout(function () {
                var key = searchBox.value().trim();
                if (key != previousSearchKey) {
                    if (key) {
                        $.post($.base.ajaxUrl("user", "Search"), { type: 'user', key: key }, function (result) {
                            showSearchResult(result.data);
                        })
                    }
                    else {
                        showSearchResult([]);
                    }
                    previousSearchKey = key;
                }
            }, 1000)

            if ($event.keyCode == 9 || $event.keyCode == 13) {
                toggleSearchFirst();
            }
            else if ($event.keyCode == 38) {
                toggleSearchFirst(-1);
            }
            else if ($event.keyCode == 40) {
                toggleSearchFirst(1);
            }
        })
    }

    function toggleSearchFirst(add) {
        if (!searchNode) return;
        $.Event.stop(true);
        if (add) {
            var index = searchNode.currentIndex
            if (index != -1 && !$event.shiftKey)
                searchNode.items[index].check(false);
            index += add;
            if (index < 0)
                index = searchNode.items.length - 1;
            else if (index >= searchNode.items.length)
                index = 0;
            searchNode.currentIndex = index
            searchNode.items[index].check();
        } else {
            var node = searchNode.items[0];
            if (node)
                node.toggleCheck();
        }
    }

    var careteRoleSelect = function (roles) {
        roles = roles.order('name').order('DESC', 'isPublic')
        var options = roles.select(function (r) {
            return '<option style="{isPublic?"color:red":""}">{name}</option>'.format(r);
        }).join('');

        var roleBox = $('<select id=role-select class=role-select ><option value="">---- 用户组 ----</option>{0}</select>'.format(options));
        $.getBody().prepend(roleBox);

        roleBox.change(function () {
            clearTimeout(this.roleChangeHandler)
            this.roleChangeHandler = setTimeout(function () {
                tree.async.data.role = roleBox.value().trim();
                searchNode = null;
                tree.root.removeItem(tree.root.items);
                tree.root.collapse();
                tree.root.leaf = false;
                tree.root.expand();
            }, 300)
        })
    }

    if ($.getQuery("supper-role") == "1") {
        $.post($.base.ajaxUrl('role', 'RuleNames'), function (res) {
            if (res.success)
                careteRoleSelect(res.data)
        })
    }

    if (hasParent && $.getQuery("auto-height") == "1") {
        treeContainer.on("sizechange", function () {
            frameElement.style.height = (document.body.offsetHeight) + "px";
            //frameElement.style.height = (treeContainer.rect().height + 50) + "px";
        })
    }
    else {
        setTimeout(function () {
            var top = treeContainer[0].offsetTop;
            treeContainer.height(document.documentElement.scrollHeight - top);
        }, 100)
    }
} ();