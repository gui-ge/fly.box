<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Header.ascx.cs" Inherits="Fly.Box.Portal.portal.controls.Header" %>
<%@ Register Src="Menus.ascx" TagName="Menus" TagPrefix="uc" %>
<div class="page-wrap" id='header'>
    <div class='page-content'>
        <div id="logo-block"><a href='<%=ResolveClientUrl("~/index.aspx") %>'><script>$L('trademarkName')</script></a></div>
        <div id="login-block">
            <%--<div class='header-left'></div>--%>
            <div class='header-right'>
                <% var diskUrl=Fly.Core.WebUtils.ResolveUrl("~/fly.box/index.htm");%>
                   <a href="<%=Fly.Box.Core.AccountState.Logined?diskUrl:Fly.Box.Core.AccountState.GetLoginPage(diskUrl,false) %>"><script>$L('diskName')</script></a>
                <% if (Fly.Box.Core.AccountState.Logined)
                   {%>
                   <a href="<%=Request.RawUrl.ToLower().Contains("personal.htm")?ResolveClientUrl("~/u-share.aspx/"+Fly.Box.Core.BoxContext.CurrentUser.LoginName): UserSettingUrl %>"><%=Fly.Box.Core.AccountState.CurrentUserInfo.User.NickName %></a> 
                   <a href='<%=Fly.Core.WebUtils.ResolveUrl("~/user/logout.aspx") %>'>退出</a>
                <%}
                   else
                   { %>
                <a href="<%=Fly.Box.Core.AccountState.GetLoginPage("CURRENT", false) %>">登录</a>
                <%} %>
            </div>
        </div>
    </div>
    <uc:Menus ID="menus" runat="server" />
</div>
