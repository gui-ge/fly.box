<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SearchContent.ascx.cs"
    Inherits="Fly.Box.Portal.portal.controls.SearchContent" %>
<link href="<%=this.ResolveUrl("~/portal/themes/default/search.css") %>" rel="stylesheet" type="text/css" />
<div class="page-wrap" id='share'>
    <div class="page-inner">
        <div class='page-content'>
            <%
                var shares = Query();
                if (shares.Length == 0)
                {
                    if (!string.IsNullOrEmpty(this.SearchKey))
                    {
                    %><h1 class="empty-page-msg">抱歉！没有找到与“<%=this.SearchKey%>”相关的分享。</h1><%
                    }
                }
                else
                {
                    %><h1>为你找到“<%=this.SearchKey%>”相关的<%=shares.Length %>个分享</h1>
                    <%if (PageCount > 1)
                      { %>
                    <div class='pager pager-above'><a <%=PreviousPageUrl==null?"class='page-disabled'": "href='"+PreviousPageUrl+"'"%> >上一页</a>
                         <a <%=NextPageUrl==null?"class='page-disabled'": "href='"+NextPageUrl+"'"%> >下一页</a>
                    </div>
                    <%} %>

                    <table id='search-results'><%
                        shares.ForEach(share =>
                        {
                        %>
                            <tr class="search-result">
                                <td class='title'>
                                    <a target='_blank' href="<%=Fly.Box.Core.ShareServiceBase.GetSharePublicUrl(share.FetchCode) %>"><%=share.Title%></a>
                                </td>
                                <td class='size'><%=Fly.Box.Core.BoxContext.MyIOHelper.SizeFormat(share.Size)%></td>
                                <td class='user'><a target='_blank' href='<%=this.ResolveClientUrl("~/u-share.aspx/")+share.ShareUserId %>' ><%=share.ShareUser%></a></td>
                                <td class='time' ><%=share.Time.ToString("yyyy-MM-dd HH:mm")%></td>
                            </tr>
                        <%
                        });
                    %></table>
                    <%if (PageCount > 1){ %>
                    <div class='pager pager-below'><a <%=PreviousPageUrl==null?"class='page-disabled'": "href='"+PreviousPageUrl+"'"%> >上一页</a>
                         <a <%=NextPageUrl==null?"class='page-disabled'": "href='"+NextPageUrl+"'"%> >下一页</a>
                    </div>
                    <%}
                }
            %>
        </div>
    </div>
</div>
<script>
    setTimeout(function () {
        $('#search-results .title').each(function () {
            this.title = this.innerText;
        })
        $('#search-results .user').each(function () {
            this.title ='分享用户：' + this.innerText;
        })
    });
</script>