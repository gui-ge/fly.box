<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Footer.ascx.cs" Inherits="Fly.Box.Portal.portal.controls.Footer" %>
<div class="page-wrap" id="footer">
    <div id="footer-inner">
        <div class='page-content' >
            <div class='copyright'><script>$L('copyLogin')</script></div>
        </div>
    </div>
</div>
<% this.Response.Write(string.Format("<script src='{0}'></script>", this.ResolveUrl("~/fly.box/do/SuperEx.ashx"))); %>