$.flyVer = "v2.4.0";
$.isDebug = location.href.indexOf('http://localhost') > -1;
$.pathPart = $.flyVer + ($.isDebug ? '&' + Math.random() : '');
window.isPortal = 1;

!function () {
    var $ = jQuery;
    var supportPlaceHolder = 'placeholder' in document.createElement('input');
    window.flyBox = window.flyBox || {};
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var url = (scripts[i].src || '').toLowerCase();
        var index=url.indexOf("portal/scripts/common.js");
        if (index > -1) {
            flyBox.appUrl = url.substr(0,index);
            break;
        }
    }



    var _top = top, isPC = !!_top.nwDispatcher;

    var _alert = window.alert;
    window.alert = function (msg) {
        msg != null && msg != "" && _alert(msg);
    }



    if (isPC) {
        
        var msgPath = _top.nwDispatcher.getAbsolutePath('app/views/msg-box.htm')
        window.alert = function (msg, isConfirm) {
            if (msg == null)
                msg = "";
            else
                msg = msg.toString();

            var args = { message: msg, isConfirm: isConfirm === true }
            var height = msg.split(/\r|\n/).length * 30 + 100;
            return window.showModalDialog(msgPath, args, 'dialogHeight=' + height + 'px; dialogWidth=350px; center=yes; resizable=no; status=no');
        }

        window.confirm = function (msg) {
            return alert(msg, true);
        }

        var _open = window.open;
        window.open = function (url, name) {
            if (name != "_top" && name != "_self")
                top.postMessage({ type: 'open', args: arguments, ref: this.location.href }, '*');
            else
                _open.apply(window, arguments);
        }

        window.evalPC = function (js, args) {
            var id;
            if (args) {
                id = Math.random().toString().substr(3);
                args.topId = id;
                _top[id] = args;
            }
            return _top.postMessage({ type: 'evalPC', js: js, args: id }, '*');
        }

        $(document.documentElement).click(function (evt) {
            if (evt.target && evt.target.nodeName == 'A') {
                var a = evt.target;
                if (a.href && a.target == '_blank') {
                    open(a.href)
                    return false
                }
            }
        })


        //        window.evalPC = function (js, cb, autoDelCB) {
        //            var id = Math.random().toString().substr(3);
        //            cb.topId = id;
        //            top[id] = function () {
        //                var res = cb.apply(null, arguments);
        //                if (autoDelCB !== false)
        //                    delete top[id]
        //                return res;
        //            }
        //            return top.postMessage({ type: 'evalPC', js: js, cb: id }, '*');
        //        }
    }



    flyBox.PlaceHolder = function (boxSelector) {
        if (supportPlaceHolder)
            return;

        this.boxs = $(boxSelector);
        this.boxs.blur(this.blur);
        this.boxs.focus(this.focus);
        this.boxs.trigger('blur');
    }
    var PlaceHolderP = flyBox.PlaceHolder.prototype
    $.extend(PlaceHolderP, {
        css: 'placeholder',
        blur: function () {
            var box = $(this);
            var val = box.val();
            var place = box.attr('placeholder');
            if (val == '' || val == place) {
                box.addClass(PlaceHolderP.css);
                box.val(place);
            }
        },
        focus: function () {
            var box = $(this);
            var val = box.val();
            var place = box.attr('placeholder');
            box.removeClass(PlaceHolderP.css);
            if (val == place) {
                box.val('');
            }
        }
    });

    window.$L = function (key) {
        for (var i = 0; i < arguments.length; i++) {
            var k = arguments[i];
            var txt = k.indexOf('{')>-1 ? k.format($lang) : $lang[k]
            document.write(txt);
        }
    }
} ();