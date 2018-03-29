<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Search.ascx.cs" Inherits="Fly.Box.Portal.portal.controls.Search" %>
<form id="fetch-block">
    <input id='fetch-code' class='focus-box' placeholder='<%=Placeholder %>' value='<%=SearchKey %>' />
    <%if (ShowFetchButton)
      { %>
    <a id='fetch-button' href='#' class="submit-button">提取文件</a>
    <%}
      if (ShowSearchButton)
      { %>
    <a id='search-button' href='#' class="submit-button">搜索</a>
    <%} %>
</form>
<script src="<%=this.ResolveUrl("~/portal/scripts/search.js?v2.4.0") %>" type="text/javascript"></script>
