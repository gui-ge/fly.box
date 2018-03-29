<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="to.aspx.cs" Inherits="Fly.Box.Portal.To" %>

<%@ Register Src="portal/controls/Header.ascx" TagName="Header" TagPrefix="uc" %>
<%@ Register Src="portal/controls/Footer.ascx" TagName="Footer" TagPrefix="uc" %>
<%@ Register src="portal/controls/PageMeta.ascx" tagname="PageMeta" tagprefix="uc" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>网盘</title>
    <link href="<%=this.ResolveUrl("~/portal/themes/default/css.css?v2.4.0") %>" rel="stylesheet"
        type="text/css" />
   <uc:PageMeta ID="meta" runat="server" />
    <style type="text/css">
        iframe
        {
            width:100%;
            margin-left:-15px;
        }
    </style>
</head>
<body>
    <uc:Header ID="header" runat="server" />
    <div class="page-wrap" id='share'>
        <div class="page-inner">
            <div class='page-content'>
                <iframe src="<%=ToUrl %>" frameborder='0' scrolling="no"></iframe>
            </div>
        </div>
    </div>
    <uc:Footer ID="footer" runat="server" />
    <script type="text/javascript">
        var frame = document.getElementsByTagName("iframe")[0];
        var dHeight = 50;
        setInterval(function () {
            var doc = frame.contentWindow.document;
            if (!doc)
                return;
            var height = Math.max(doc.documentElement.clientHeight, doc.documentElement.offsetHeight, doc.documentElement.scrollHeight);
            if (doc.body)
                height = Math.max(height, doc.body.clientHeight, doc.body.offsetHeight, doc.body.scrollHeight);
            frame.style.height = (height + dHeight) + "px";
            dHeight = 0;
            if (doc.title) {
                document.title = doc.title;
            }
        }, 500)
    </script>
</body>
</html>
