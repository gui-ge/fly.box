<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="IndexContent.ascx.cs"
    Inherits="Fly.Box.Portal.portal.controls.IndexContent" %>
<%@ Register src="Search.ascx" tagname="Search" tagprefix="uc" %>
<script src="portal/scripts/flexslider/jquery.flexslider-min.js" type="text/javascript"></script>
<link href="portal/scripts/flexslider/flexslider.css" rel="stylesheet" type="text/css" />
<link href="portal/themes/default/index.css" rel="stylesheet" type="text/css" />
<div class="page-wrap" id="content">
    <div class="page-inner">
        <%var slides=SildeImages;
          if (slides != null && slides.Length > 0)
          { %>
        <div class='page-content'>
            <div class='flexslider'>
                <ul class="slides">
                    <%slides.ForEach(slide => { 
                        %>
                        <li><img alt="<%=slide.Title %>" src="<%=slide.Url %>" />
                            <% if (!string.IsNullOrEmpty(slide.Summary))
                               { %>
                                <div class="summary"><%=slide.Summary %></div>
                               <%} %>
                        </li>
                        <%
                      }); %>
                </ul>
            </div>
            <script type="text/javascript">
                $('.flexslider').flexslider({
                    animation: "fade",
                    start: function (slider) {
                        $('body').removeClass('loading');
                    }
                });
            </script>
        </div>
        <%} %>
        <div class='page-content'>
            <uc:Search ID="search" runat="server" ShowSearchButton="true" ShowFetchButton="true" />
        </div>
        <div class='page-content'>
            <div id='new-shares' class='list-block'>
                <div>最新上传</div>
                <ul>
                <%
                    var newShares = GetNewShares(10);
                    newShares.ForEach(share =>
                    {
                     %>
                    <li><a href="<%=Fly.Box.Core.ShareServiceBase.GetSharePublicUrl(share.FetchCode)%>"><%=share.Title %></a><span><%=share.Time.ToString("yyyy-MM-dd hh:mm") %></span></li>
                    <%}); %>
                </ul>
            </div>
            <div id='hot-shares' class='list-block'>
                <div>热门资源</div>
                <ul>
                     <%
                    var hotShares =GetHotShares(10);
                    hotShares.ForEach(share =>
                    {
                     %>
                    <li><a href="<%=Fly.Box.Core.ShareServiceBase.GetSharePublicUrl(share.FetchCode)%>"><%=share.Title %></a><span><%=share.Time.ToString("yyyy-MM-dd hh:mm") %></span></li>
                    <%}); %>
                </ul>
            </div>
            <div id='share-users' class='list-block'>
                <div>分享达人</div>
                <ul>
                  <%
                    var shareUsers = GetShareUsers(10);
                    shareUsers.ForEach(user =>
                    {
                        var url = this.ResolveClientUrl("~/u-share.aspx/" + user.Key.LoginName);
                     %>
                    <li><a href="<%=url %>"><%=user.Key.NickName%></a> <span><%=user.Value%>个分享</span></li>
                    <%}); %>
                </ul>
            </div>
        </div>
    </div>
</div> 