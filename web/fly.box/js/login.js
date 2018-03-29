window.needLogin = false

if ($.browser.isIE && $.browser.ieVersion < 7) {
    $.getBody().append('<div id=ie6-warning >您的浏览器版本太低，部分功能无法正常使用，推荐<a href="http://rj.baidu.com/soft/detail/14744.html?ald" title="也可以升级IE版本">使用 Google Chrome 浏览器访问</a>，<a href="http://rj.baidu.com/soft/detail/14744.html?ald">点击下载</a></div>')
    $('#ie6-warning').fadeIn();
}

var account = fly.Cookie.get('account');
var pwd = fly.Cookie.get('pwd');
if (account)
    $("#account-box input").val(account)
if (pwd) {
    $("#password").val("EN:" + pwd)
    $("#auto-login").attr("checked", true)
}


var accountBox = new $.ui.EmptyBox("#account-box input");
var pwdBox = new $.ui.EmptyBox('#password')
var btnLogin = $("#login"), btnForget = $('#forget-pwd');
var btnRegist = $('#regist');
var loginBox = $('#login-box');
$('#login-buttons').show();

function showMessage(msg) {
    $.common.showMessage(msg);
}

function validate(vPwd) {
    if (!accountBox.value())
        return '请输入帐号/手机/邮箱'
    if (vPwd && !pwdBox.value())
        return '请输入密码';
}

btnLogin.click(function () {
    var msg = validate(true)
    if (msg) {
        showMessage(msg);
        return false
    }

    btnLogin.disable()
    $.post({
        url: "do/login.ashx",
        data: {
            account: accountBox.value(),
            password: pwdBox.value(),
            "auto-login": $("#auto-login").attr("checked") ? 1 : 0
        },
        success: function (result) {
            if (result.success) {
                var to = $.getQuery('to');
                to = to || "index.htm?" + $.flyVer;
                if (to.indexOf('http://') < 0)
                    to = decodeURIComponent(to);
                window.location.href = to;
            }
            else {
                showMessage(result.msg);
            }
            btnLogin.enable()
        },
        onError: function (err, xhr) {
            btnLogin.enable();
        }
    }).setLoading({ box: loginBox.$('form')[0], css: 'f-loading' });
    return false;
});

btnForget.click(function () {
    var msg = validate()
    if (msg) {
        showMessage(msg);
        return false
    }
    btnForget.disable()
    $.post({
        url: "do/applyResetPassword.ashx",
        data: {
            account: accountBox.value()
        },
        success: function (result) {
            if (result.success) {
                var msg = '已将密码重置连接发送至你的邮箱“{0}”，请在48小时内进入邮箱按提示重设密码。'.format(result.data)
                showMessage(msg);
                alert(msg);
                alert(msg);
            }
            else {
                showMessage(result.msg);
            }
            btnForget.enable();
        }
    })
    return false;
})

btnRegist.click(function () {
    loginBox.empty()
    loginBox.append('<iframe id=regist-frame src="../fly.base/regist.htm?to={0}" frameborder=0 scrolling=no allowtransparency=true ></iframe>'.format(location.href))
    $.doc.addClass('regist-mode')
    loginBox.fadeIn();
})

if (location.href.indexOf('show-no-login-msg') > -1) {
    showMessage('请先登录，该页面需要登录才能访问！');
}

if (window.nwDispatcher) {
    $(document.documentElement).hide();
    function checkPC() {
        var to = $.getQuery('to');
        top.postMessage({ type: 'login', to: to }, '*');
        return

    }
    checkPC()
    setTimeout(checkPC, 200);
}
