<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="u-share.aspx.cs" Inherits="Fly.Box.Portal.UserShare" %>

<%@ Register Src="portal/controls/Header.ascx" TagName="Header" TagPrefix="uc" %>
<%@ Register Src="portal/controls/Footer.ascx" TagName="Footer" TagPrefix="uc" %>
<%@ Register Src="portal/controls/Search.ascx" TagName="Search" TagPrefix="uc" %>
<%@ Register src="portal/controls/PageMeta.ascx" tagname="PageMeta" tagprefix="uc" %>
<%@ Register Src="portal/controls/UserShareHome.ascx" TagName="UserShareHome" TagPrefix="uc" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title><%=this.userHome.User==null?this.userHome.UserName:this.userHome.User.NickName %>的分享</title>
    <uc:PageMeta ID="meta" runat="server" />
</head>
<body>
    <uc:Header ID="header" runat="server" />
    <div class='page-content'>
        <uc:Search ID="search" runat="server" ShowSearchButton="true" />
    </div>
    <uc:UserShareHome ID="userHome" runat="server" />
    <uc:Footer ID="footer" runat="server" />
</body>
</html>
