<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="UserShareHome.ascx.cs"
    Inherits="Fly.Box.Portal.portal.controls.UserShareHome" %>
<link href="<%=this.ResolveUrl("~/portal/themes/default/u-share.css") %>" rel="stylesheet" type="text/css" />
<div class="page-wrap" id='share'>
    <div class='page-content'>
        <div class="user-ico" style='background-image:url(<%=Fly.Box.Core.UserServiceBase.GetUserIcon(this.User.Id) %>)'></div>
        <div class='user-infos text-ellipsis'>
            <div class='user-name'><%=IsSelf ? "<a href='{0}&current=base'>{1}</a>".format(UserSettingUrl, this.User.NickName) : this.User.NickName%></div>
            <div class="user-sign light" title="<%=this.UserSignature %>">
                   <%=this.UserSignature ?? ("亲，今天"+DateTime.Now.ToString("dddd", new System.Globalization.CultureInfo("zh-CN"))+"哦！") %>
                   <%if (this.IsSelf)
                   {%><a class="submit-button" href='<%=UserSettingUrl %>&current=sign'>编辑</a><%} %>
            </div>
            <div class="user-hot light"><span><%=UserAllShareCount%>个分享</span></div>
        </div>
    </div>
    <div class="page-inner">
        <div class='page-content'>
            <%
                var shares = Query();
                var key=SearchKey;
                if (ShareCount == 0)
                { 
                    %><h1 class="empty-page-msg">抱歉！“<%=this.User.NickName%>”暂时没有分享<%=string.IsNullOrEmpty(key) ? "" : "“" + key + "”相关的"%>文件。</h1><%
                }
                else
                {
                    if (!string.IsNullOrEmpty(key))
                    {%>
                    <h1>为你找到“<%=this.SearchKey%>”相关的<%=ShareCount%>个分享</h1>
                    <%} 
                    if (PageCount > 1){ %>
                    <div class='pager pager-above'><a <%=PreviousPageUrl==null?"class='page-disabled'": "href='"+PreviousPageUrl+"'"%> >上一页</a>
                         <a <%=NextPageUrl==null?"class='page-disabled'": "href='"+NextPageUrl+"'"%> >下一页</a>
                    </div>
                    <%}%>

                    <table id='user-shares'>
                    <%
                    shares.ForEach(share =>
                    {
                        %>
                            <tr class="search-result">
                                <td class='title'>
                                    <a target='_blank' href="<%=Fly.Box.Core.ShareServiceBase.GetSharePublicUrl(share.FetchCode) %>"><%=share.Title%></a>
                                </td>
                                <td class='size'><%=Fly.Box.Core.BoxContext.MyIOHelper.SizeFormat(share.Size)%></td>
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
                }%>
        </div>
    </div>
</div>
<script>
    var allowSearchEmpty = true;
    var searchUrl = '<%=this.ResolveClientUrl("~/u-share.aspx/{0}".format(this.UserName)) %>?key={0}';
    setTimeout(function () {
        $('#search-results .title').each(function () {
            this.title = this.innerText;
        })
        $('#search-results .user').each(function () {
            this.title ='分享用户：' + this.innerText;
        })
    });
</script>