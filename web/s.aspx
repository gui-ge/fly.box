<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="s.aspx.cs" Inherits="Fly.Box.Portal.SharePage" %>

<%@ Register Src="portal/controls/Header.ascx" TagName="Header" TagPrefix="uc" %>
<%@ Register Src="portal/controls/Footer.ascx" TagName="Footer" TagPrefix="uc" %>
<%@ Register Src="portal/controls/ShareContent.ascx" TagName="Share" TagPrefix="uc" %>
<%@ Register src="portal/controls/PageMeta.ascx" tagname="PageMeta" tagprefix="uc" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title><%=this.share.Share==null?"":this.share.Share.Title%></title>
    <uc:PageMeta ID="meta" runat="server" />
</head>
<body>
    <uc:Header ID="header" runat="server" />
    <uc:Share ID="share" runat="server" />
    <uc:Footer ID="footer" runat="server" />
</body>
</html>
