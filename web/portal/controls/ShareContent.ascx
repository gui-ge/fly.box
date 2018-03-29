<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ShareContent.ascx.cs"
    Inherits="Fly.Box.Portal.portal.controls.ShareContent" %>
<link href="<%=this.ResolveUrl("~/portal/themes/default/share.css") %>" rel="stylesheet" type="text/css" />
<script src="<%=this.ResolveUrl("~/fly.common/fly/fly.js?v2.4.0") %>" type="text/javascript"></script>
<script src='<%=this.ResolveClientUrl("~/fly.box/common/common.js?v2.4.0")%>' type="text/javascript" defer='defer'></script>
<script src="<%=this.ResolveUrl("~/portal/scripts/share.js?v2.4.0") %>" type="text/javascript"></script>
<div class="page-wrap" id='share'>
    <div id='share-inner' class='page-inner'>
        <%if(this.Share!=null) 
          { %>
            <script>var shareId = '<%=this.Share.FetchCode %>'</script>
        <%}
          //分享不存在
            if (this.Share == null) 
          {%>
            <h1 class='page-content share-no-exists'>亲，你来晚了哦，分享的文件已经被取消了，下次早点来哟！</h1>
        <%}
            //分享的状态有异常
            else if (this.Share.Status != Fly.Box.Core.InfoStatus.Normal.ToInt() || this.ShareCheckResult== Fly.Box.Core.ShareCheckResult.UnknownError ) 
          { %>
            <h1 class='page-content share-status-error'>该分享已被删除或禁止。</h1>
        <%}
            //需要验证提取密码
            else if (this.ShareCheckResult == Fly.Box.Core.ShareCheckResult.NeedPassword)     
          { %>
        <div class='page-content share-password'>
            <form onsubmit="return validatePassword();">
                <a id='A1'></a><h1 id='H1' title="<%=this.Share.Title%>"><%=this.Share.Title%></h1>
                <label>请输入提取密码：</label>
                <input class='focus-box' id="password-box"/>
                <button class="share-validate-password submit-button" type='submit' >提取文件</button>
            </form>
        </div>
        <%}
            //未分享给当前用户
            else if (this.ShareCheckResult== Fly.Box.Core.ShareCheckResult.NotSharedToUser) 
          { %>
            <h1 class='page-content share-status-error'><%=this.CheckMessage%></h1>
        <%}
            //未验证通过
            else if (this.ShareCheckResult!= Fly.Box.Core.ShareCheckResult.OK) 
          { %>
            <h1 class='page-content share-status-error'>该分享已被删除或禁止。</h1>
        <%}
            else{ %>
        <div class='page-content share-header'>
            <div id='top-btns'>
                <%if (this.IsSelf)/*自己的分享*/
                  { %>
                <%}
                  else if(CanDownload)
                  { %>
                <a class='share-save-to submit-button' href='#' onclick='return saveTo()'><i></i>保存到我的网盘</a>
                <%}
  
                  if (CanDownload && Model.FolderCount == 0 && Model.FileCount == 1)   //分享单个文件，可直接下载
                  {
                  %>
                <a class='share-down submit-button' href="<%=this.ResolveUrl("~/fly.box/d.ashx/c-{0}/{1}".format(this.Share.FetchCode,this.Share.Title)) %>" target='_blank' ><i></i>下载(<%= Fly.Box.Core.BoxContext.MyIOHelper.SizeFormat(this.Share.Size)%>)</a>
                <%} %>
                <a class='share-praise submit-button <%=this.Model.Praised?"share-praised":"" %>' href=# onclick="return praise(this)" title='<%=this.Model.Praised?"不赞了":"赞一个吧" %>'><i></i><span>赞(<%=this.Model.PraiseCount%>)</span></a>
                <a class='share-comment submit-button' href='#comments' ><i></i>评论(<%=this.Model.CommentCount%>)</a>
            </div>

            <a id='share-icon'></a><h1 id='share-title' title="<%=this.Share.Title%>"><%=this.Share.Title%></h1>
            <div id="share-infos" class="gray">分享时间：<%=this.Share.Time.ToString("yyyy-MM-dd HH:mm")%> &nbsp; &nbsp;<%=this.Model.BrowseCount%>次浏览 &nbsp; &nbsp;<%=this.Model.SaveToCount%>次保存</div>
        </div>
        <div class='page-content share-files'>
            <iframe id='frame-share-files' src="<%=this.ResolveUrl("~/fly.box/file/manage.htm?c={0}&view-share&no-skin&$no-login".format(this.FetchCode)) %>" frameborder='0' scrolling='no'  allowTransparent='1'></iframe>
        </div>
        <div class='page-content share-summary'>
            <asp:Literal ID="shareSummary" runat="server" ></asp:Literal>
        </div>
        <div id='comment-block' >
            <a name='comment-start' id='comment-caption' >评论：</a>
            <div id='comments'>
                <%
                    this.Comments.ForEach(comment => { 
                    %>
                        <div id="comment-<%=comment.Id %>" class='comment'>
                            <% 
                                if (this.AccountInfo != null && ((bool)this.AccountInfo.User.IsDiskManager || comment.UserId == this.AccountInfo.UserId))
                                {
                            %>
                                <a class=btn-del-comment onclick="delComment('<%=this.Share.FetchCode %>','<%=comment.Id %>')">删除</a>
                            <%  }%>

                            <div class=comment-info >
                                <span class=comment-user ><%=comment.UserName %></span>
                                <span class=comment-time ><%=comment.Time.ToString("yyyy-MM-dd hh:mm") %></span>
                            </div>
                            <div class=comment-content><%=comment.Content %></div>
                        </div>
                    <%
                    });
                    %>
            </div>
            <textarea id='txt-comment' maxlength=400 ></textarea>
            <button id='btn-comment' class='submit-button' onclick='return comment()'>发表评论</button>
            <a name='comments'></a>
        </div>
        <%}%>
    </div>
</div>
  