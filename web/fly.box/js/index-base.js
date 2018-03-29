/// <reference path="../common/common.js" />

!function () {
    var $ = fly;
    window.indexPath = '';

    fly.box.IndexBase = $.Class({
        constructor: function () {
            this.createMembers();
            $.base.setContentFrame(this.contentFrame[0]);
            this.bindEvents();
            this.getLoginInfo();
            this.getMessage();
            setTimeout(function () {
                var tree = $.Cookie.get('index-tree') || '';
                if (tree.contains('org'))
                    indexPage.toggleOrgTree()
                if (tree.contains('my'))
                    indexPage.toggleMyTree()
            })
        },
        rebuildPage: function (cmd) {
            location.reload();
        },
        getMessage: function () {
            var get = function () {
                var last = indexPage.newWorks ? indexPage.newWorks[0] : null;
                $.post($.box.ajaxUrl('Work', 'MessageRemind'), {
                    lastId: last ? last.id : null,
                    lastTime: (last ? last.time : null)
                }, function (res) {
                    if (res.success && res.data && res.data != "NOCHANGE") {
                        indexPage.showMessage(res.data);
                    }
                    setTimeout(get, 60000);
                })
            }
            setTimeout(get, 10000)
        },
        showMessage: function (info) {
            //有消息，且最后的消息和上一次提醒的不一样
            this.topMsgBox.show();

            this.newWorks = info.works
            this.showWorksInTop(info.works);
            if (info.counts) {
                var count = 0;
                var htmls = [];

                $.each(info.counts, function (c, t) {
                    count += c;
                    if (c) {
                        htmls.push('<b style="color:red">{0}</b> 个{1}'.format(c, t));
                    }
                })

                if (count == 0)//没有或者全是公告
                    return;

                var html = htmls.length == 1 ? "你有 " + htmls[0] + "待处理" : "你有 <b style='color:red'>{0}</b> 个事务待处理：<ul><li>{1}</li></ul>".format(count, htmls.join('</li><li>'))
                html += "<a href='common/list.htm?m=oa&list=inbox' target=f class=submit-button onclick='indexPage.topMsgBox.hide();$.common.showMessage()' style='margin-left:80px'>去看看 ➽</a>";
                $.common.showMessage(html, false, false);

                $.box.postMessage({ type: 'message', count: count });
            }
        },
        showWorkInTop: function (work) {
            var old = this.topMsgBox.children();
            //old.animate({ left: -500 }, 200)
            old.fadeOut();
            clearTimeout(indexPage.showWorkInTopHandle2);
            indexPage.showWorkInTopHandle2 = setTimeout(function () {
                old.remove();
                var newA = $('<a style="position:relative;display:none" href="{1}" target=f onclick="indexPage.topMsgBox.hide();$.common.showMessage()" >{title}{0}<a/>'.format(work.type == "事务" ? "" : "(" + work.type + ")", work.url, work));
                indexPage.topMsgBox.append(newA);
                newA.fadeIn();

                indexPage.msgAlt = indexPage.msgAlt == 0 ? 1 : 0;
                newA.attr('className', indexPage.msgAlt ? 'alt' : '');
            }, 210)
        },
        showWorksInTop: function (works) {
            if (!works.length)
                return this.topMsgBox.html('')

            var index = 0;
            var toggle = function () {
                indexPage.showWorkInTop(works[index])
                index++;
                if (index >= works.length)
                    index = 0;
                clearTimeout(indexPage.showWorkInTopHandle);
                indexPage.showWorkInTopHandle = setTimeout(toggle, 5000);
            }
            toggle();
        },
        loginInfo: { folderMenus: {} },
        getLoginInfo: function () {
            $.base.getUserContext(function () {
                indexPage.init(window.userContext);
                indexPage.afterInit();
            });
        },
        afterInit: function () {
            if ($.box.isPC && window.userContext.space) {
                evalPC('loginSpace(args)', window.userContext.space)
            }
        },
        bindEvents: function () {
            var me = this;
            this.searchForm.click(function () {
                if ($event.target.nodeName == 'FORM')
                    search(me.searchBox.value());
            })

            this.searchForm.submit(function () {
                search(me.searchBox.value());
                return false;
            });
        },
        logout: function () {
            $.post($.box.ajaxUrl('sys', 'logout'), function (result) {
                if (result.success) {
                    window.open(result.data || $.box.getLoginUrl(), '_top');
                }
                else {
                    $.alert(result.msg)
                }
            })
        },
        showSpaceSize: function () {
            var space = this.loginInfo.space;
            var scale = space.used * 100 / space.size;
            if (scale > 0 && scale < 1)
                scale = 1
            $('#space-size-pro div').width(scale + '%')
            $('#space-size').html('{0} / {1}'.format($.sizeFormat(space.used), $.sizeFormat(space.size)))
            $('#space-size').parent().attr('title', '空间总大小{0}，已使用{1}。'.format($.sizeFormat(space.size), $.sizeFormat(space.used)))


            var space = this.loginInfo.userSpace;
            var scale = space.used * 100 / space.size;
            if (scale > 0 && scale < 1)
                scale = 1
            $('#user-space-size-pro div').width((scale||0 )+ '%')
            $('#user-space-size').html('{0} / {1}'.format($.sizeFormat(space.used), $.sizeFormat(space.size)))
            $('#user-space-size').parent().attr('title', '空间总大小{0}，已使用{1}。'.format($.sizeFormat(space.size), $.sizeFormat(space.used)))
        },
        openDir: function (type, id) {
            var anotherTree = this[(type == 'org' ? 'my' : 'org') + 'Tree'];
            if (anotherTree)
                anotherTree.selectedItems[0] && anotherTree.selectedItems[0].select(false);

            var fWin = window.frames['content-frame']
            fWin = fWin.contentWindow || fWin;
            if (fWin.manager && fWin.manager.rootType == type) {
                fWin.manager.openDir(id);
            }
            else {
                window.open('file/manage.htm?$with-org={1}&path={0}'.format(id, type == 'org' ? 1 : ''), 'f');
            }
        },
        loadTree: function (type) {
            if (this[type + 'TreeLoaded'])
                return;
            this[type + 'TreeLoaded'] = true;
            var el = $('#tree-menu-block-' + type);
            $.common.createTree({
                container: el[0],
                root:{id:'@'},
                itemEvents: {
                    panel: {
                        click: function (node) {
                            indexPage.openDir(type, node.id);
                        }
                    }
                },
                async: {
                    url: $.box.ajaxUrl('SpaceFile', 'ForSelect', "parentId={id}&space=" + type + "&type=Folder"),
                    method: "post"
                },
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
            }, function (tree) {
                indexPage[type + 'Tree'] = tree;
            });
        },
        toogleTree: function (type) {
            var css = type + '-tree-show';
            var cookie = $.Cookie.get('index-tree') || '';
            cookie = cookie.replace(type, '');
            if ($.doc.hasClass(css)) {
                $.doc.removeClass(css);
            }
            else {
                $.doc.addClass(css);
                this.loadTree(type)
                cookie += type;
            }

            $.Cookie.set('index-tree', cookie);
        },
        toggleMyTree: function () {
            this.toogleTree('my')
        },
        toggleOrgTree: function () {
            this.toogleTree('org')
        }
    });

    window.search = function (key) {
        try {
            indexPage.contentFrame[0].contentWindow.search(key);
        } catch (e) { }
    }
} ()

