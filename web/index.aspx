<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="Fly.Box.Portal._Index._Default" %>

<%@ Register src="portal/controls/Header.ascx" tagname="Header" tagprefix="uc" %>
<%@ Register src="portal/controls/Footer.ascx" tagname="Footer" tagprefix="uc" %>
<%@ Register src="portal/controls/IndexContent.ascx" tagname="IndexContent" tagprefix="uc" %>
<%@ Register src="portal/controls/PageMeta.ascx" tagname="PageMeta" tagprefix="uc" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html id='page-index'>
<head id="Head1" runat="server">
    <title><%=Fly.Box.Core.BoxContext.TopOrg.Name %>-网盘分享中心</title>
    <uc:PageMeta ID="meta" runat="server" />
</head>
<body>
    <uc:Header ID="header" runat="server" />
    <script>        document.title = "<%=Fly.Box.Core.BoxContext.TopOrg.Name %>-" + $lang.diskName + '分享中心'</script>
    <uc:IndexContent ID="indexContent" runat="server" />
    <uc:Footer ID="footer" runat="server" />
</body>
</html>
