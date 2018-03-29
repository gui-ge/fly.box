/*
	Fly.Box-2.2.2 升级至 Fly.Box-2.3.0

	2015-11-13 友百利
*/

SET NUMERIC_ROUNDABORT OFF
GO
SET ANSI_PADDING, ANSI_WARNINGS, CONCAT_NULL_YIELDS_NULL, ARITHABORT, QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
IF EXISTS (SELECT * FROM tempdb..sysobjects WHERE id=OBJECT_ID('tempdb..#tmpErrors')) DROP TABLE #tmpErrors
GO
CREATE TABLE #tmpErrors (Error int)
GO
SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO
BEGIN TRANSACTION
GO
PRINT N'Creating [dbo].[fly_im_GroupMember]'
GO
CREATE TABLE [dbo].[fly_im_GroupMember]
(
[Id] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[GroupId] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[UserId] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[JoinTime] [datetime] NOT NULL,
[NickName] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating primary key [PK_fly_im_GroupMember] on [dbo].[fly_im_GroupMember]'
GO
ALTER TABLE [dbo].[fly_im_GroupMember] ADD CONSTRAINT [PK_fly_im_GroupMember] PRIMARY KEY CLUSTERED  ([Id])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_im_GroupMember GroupId, UserId] on [dbo].[fly_im_GroupMember]'
GO
CREATE NONCLUSTERED INDEX [IX_fly_im_GroupMember GroupId, UserId] ON [dbo].[fly_im_GroupMember] ([GroupId], [UserId])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_GetUserFriendGroups]'
GO




-- =============================================
-- Author:		Kuiyou
-- Create date: 2015-6-18
-- Description:	查询用户所有群
-- =============================================
CREATE FUNCTION [dbo].[fly_im_GetUserFriendGroups] 
(
	@userId varchar(50)
)
RETURNS TABLE 
AS
RETURN 
(
	  WITH temp(Id,ParentId,Level) AS(
			SELECT Id,ParentId,Level=0 FROM fly_Department WHERE id=(SELECT TOP 1 DepartmentId FROM fly_User WHERE Id= @userId)
			UNION ALL
			SELECT p.Id,p.ParentId ,Level=t.Level+1 FROM fly_Department p JOIN temp t ON p.Id=t.ParentId 
		)
		SELECT * FROM temp 
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_GetUserGroupIds]'
GO





-- =============================================
-- Author:		Kuiyou
-- Create date: 2015-6-18
-- Description:	查询用户所有群Id
-- =============================================
CREATE FUNCTION [dbo].[fly_im_GetUserGroupIds] 
(
	@userId varchar(50)
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT Id From fly_im_GetUserFriendGroups(@userId)
	UNION 
	SELECT GroupId as Id From fly_im_GroupMember WHERE UserId=@userId
)



GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_Session]'
GO
CREATE TABLE [dbo].[fly_im_Session]
(
[Id] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[TargetType] [int] NOT NULL,
[GroupId] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Member1] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Member2] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[StartTime] [datetime] NOT NULL,
[CreateUserId] [varchar] (50) COLLATE Chinese_PRC_CI_AS NOT NULL,
[LastMsgTime] [datetime] NOT NULL CONSTRAINT [DF_fly_im_Session_LastMsgTime] DEFAULT (((1900)-(1))-(1))
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating primary key [PK_fly_im_Session] on [dbo].[fly_im_Session]'
GO
ALTER TABLE [dbo].[fly_im_Session] ADD CONSTRAINT [PK_fly_im_Session] PRIMARY KEY CLUSTERED  ([Id])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_im_Session TargetType GroupId] on [dbo].[fly_im_Session]'
GO
CREATE NONCLUSTERED INDEX [IX_fly_im_Session TargetType GroupId] ON [dbo].[fly_im_Session] ([TargetType], [GroupId])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_im_Session TargetType Member1] on [dbo].[fly_im_Session]'
GO
CREATE NONCLUSTERED INDEX [IX_fly_im_Session TargetType Member1] ON [dbo].[fly_im_Session] ([TargetType], [Member1])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_im_Session TargetType Member2] on [dbo].[fly_im_Session]'
GO
CREATE NONCLUSTERED INDEX [IX_fly_im_Session TargetType Member2] ON [dbo].[fly_im_Session] ([TargetType], [Member2])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_UserInfos]'
GO
CREATE TABLE [dbo].[fly_im_UserInfos]
(
[UserId] [varchar] (50) COLLATE Chinese_PRC_CI_AS NOT NULL,
[OnlineState] [int] NOT NULL
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating primary key [PK_fly_im_UserInfos] on [dbo].[fly_im_UserInfos]'
GO
ALTER TABLE [dbo].[fly_im_UserInfos] ADD CONSTRAINT [PK_fly_im_UserInfos] PRIMARY KEY CLUSTERED  ([UserId])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_im_UserInfos OnlineState] on [dbo].[fly_im_UserInfos]'
GO
CREATE NONCLUSTERED INDEX [IX_fly_im_UserInfos OnlineState] ON [dbo].[fly_im_UserInfos] ([OnlineState])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_UserSessionInfo]'
GO
CREATE TABLE [dbo].[fly_im_UserSessionInfo]
(
[UserId] [varchar] (50) COLLATE Chinese_PRC_CI_AS NOT NULL,
[TargetId] [varchar] (50) COLLATE Chinese_PRC_CI_AS NOT NULL,
[SessionId] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[ReceiveMode] [int] NOT NULL,
[LastReadTime] [datetime] NOT NULL CONSTRAINT [DF_fly_im_MessageRead_LastReadTime] DEFAULT (((1900)-(1))-(1)),
[LastNotifyTime] [datetime] NOT NULL CONSTRAINT [DF_fly_im_MessageRead_LastNotifyTime] DEFAULT (((1900)-(1))-(1))
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating primary key [PK_fly_im_MessageRead] on [dbo].[fly_im_UserSessionInfo]'
GO
ALTER TABLE [dbo].[fly_im_UserSessionInfo] ADD CONSTRAINT [PK_fly_im_MessageRead] PRIMARY KEY CLUSTERED  ([UserId], [TargetId])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_im_MessageRead] on [dbo].[fly_im_UserSessionInfo]'
GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_fly_im_MessageRead] ON [dbo].[fly_im_UserSessionInfo] ([UserId], [SessionId])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_Message]'
GO
CREATE TABLE [dbo].[fly_im_Message]
(
[Id] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[SessionId] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[SenderId] [varchar] (50) COLLATE Chinese_PRC_CI_AS NOT NULL,
[Content] [nvarchar] (500) COLLATE Chinese_PRC_CI_AS NOT NULL,
[Time] [datetime] NOT NULL
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_im_Message] on [dbo].[fly_im_Message]'
GO
CREATE CLUSTERED INDEX [IX_fly_im_Message] ON [dbo].[fly_im_Message] ([SessionId], [Time] DESC)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating primary key [PK_fly_im_Message] on [dbo].[fly_im_Message]'
GO
ALTER TABLE [dbo].[fly_im_Message] ADD CONSTRAINT [PK_fly_im_Message] PRIMARY KEY NONCLUSTERED  ([Id])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_GetOnlineUserNoReadMsgs]'
GO
-- =============================================
-- Author:		FlyUI.NET
-- Create date: 2015-8-3
-- Description:	查询所有在线用户未接收消息
-- =============================================
CREATE FUNCTION dbo.[fly_im_GetOnlineUserNoReadMsgs]
()
RETURNS TABLE 
AS
RETURN 
(
	SELECT m.* FROM fly_im_Message m
		LEFT JOIN fly_im_UserSessionInfo us 
		ON m.SessionId=us.SessionId
		WHERE 
			us.UserId IN(SELECT UserId FROM fly_im_UserInfos ui WHERE OnlineState=1)
			AND m.SessionId IN(
				SELECT Id FROM fly_im_Session s 
					WHERE (Member1=us.UserId OR Member2=us.UserId) OR s.GroupId IN(
						SELECT ID FROM dbo.fly_im_GetUserGroupIds(us.UserId)
					))
			AND (us.LastReadTime<m.Time OR us.LastReadTime IS NULL)
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Altering [dbo].[fBox_CheckSpaceFileUserACL]'
GO




-- =============================================
-- Author:		友百利
-- Create date: 2014-6-24 
-- Description:	检测用户文件权限
-- 返回值 ：是否有权限
-- =============================================
ALTER FUNCTION [dbo].[fBox_CheckSpaceFileUserACL]
(
	@spaceFileId VARCHAR(36),
	@userId	VARCHAR(36),
	@checkAcl INT
)
RETURNS BIT
AS
BEGIN
/*
declare @spaceFileId VARCHAR(36)
declare 	@userId	VARCHAR(36)
set @spaceFileId='d0416eb3-3205-4d00-a343-be7a4009ad01'
set @userId='20000000-0000-0000-0000-000000000001'
select dbo.[fBox_CheckSpaceFileUserACL]('d0bb57d1-0fc8-4e6b-b3aa-1a1453291cc9','20000000-0000-0000-0000-000000000001',2)
*/

	DECLARE @acl INT 
	
	--如果是自己的文件，有所有权限
	IF(EXISTS(SELECT 1 FROM fBox_SpaceFile WHERE Id=@spaceFileId AND UserId=@userId))
		RETURN 1
	
	SELECT TOP 1 @acl=ACL 
	FROM fBox_SpaceFileUserAuth a 
		JOIN fBox_GetFileParents(@spaceFileId,1) pf
		ON a.SpaceFileId=pf.Id
		WHERE a.UserId=@userId 
	
	--SELECT @acl
	--如果设置了用户权限，则不用检测部门和用户组权限	
	IF(@acl IS NOT NULL) BEGIN
		RETURN dbo.[fBox_CompareACLVal](@acl,@checkAcl)
	END
	
	SET @acl=null;

	--如果设置了部门权限，且禁止，则不用继续检测
	SELECT TOP 1 @acl=ACL FROM fBox_SpaceFileDepartmentAuth a 
		JOIN fBox_GetFileParents(@spaceFileId,1) pf
		ON a.SpaceFileId=pf.Id
		WHERE a.DepartmentId=(SELECT DepartmentId FROM dbo.fly_User u WHERE u.Id=@userId)

	IF (@acl IS NOT NULL AND dbo.[fBox_CompareACLVal](@acl,@checkAcl)=0) BEGIN
		RETURN 0;
	END


	--如果有其中一个角色有权限，则有权限
	IF(EXISTS(
		SELECT TOP 1 ACL FROM (
			SELECT ACL=(
					CASE WHEN ACL IS NULL THEN 
						CASE WHEN (SELECT TOP 1 IsManager FROM fly_Role WHERE Id=ra.RoleId)=1 
							THEN dbo.fBox_FileFullACL()
						ELSE 
							dbo.fBox_FileBaseACL() 
						END
					ELSE ACL END)
				FROM(
					SELECT 
					RoleId,
					ACL=(SELECT TOP 1 ACL FROM fBox_SpaceFileRoleAuth a 
						JOIN fBox_GetFileParents(@spaceFileId,1) pf
						ON a.SpaceFileId=pf.Id
						WHERE a.RoleId=ur.RoleId)
					FROM fly_UserRole ur WHERE UserId=@userId
				) ra
		)ra2
		WHERE dbo.[fBox_CompareACLVal](ACL,@checkAcl)=1
	))
		RETURN 1
	ELSE
		RETURN 0



	RETURN 0
END




GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_GetLeaveMsgs]'
GO








-- =============================================
-- Author:		Kuiyou
-- Create date: 2015-6-19
-- Description:	查询用户所有留言
-- =============================================
CREATE FUNCTION [dbo].[fly_im_GetLeaveMsgs] 
(
	@userId varchar(50)
)
RETURNS TABLE 
AS
RETURN 
(
SELECT m.* FROM fly_im_Message m
	LEFT JOIN fly_im_UserSessionInfo us 
	ON us.UserId=@userId AND m.SessionId=us.SessionId

	WHERE m.SessionId IN(
		SELECT Id FROM fly_im_Session s 
			WHERE (Member1=@userId OR Member2=@userId) OR s.GroupId IN(
				SELECT ID FROM dbo.fly_im_GetUserGroupIds(@userId)
			))
		AND (us.LastReadTime<m.Time OR us.LastReadTime IS NULL)
)

--
--select * from dbo.[fly_im_GetLeaveMsgs]('20000000-0000-0000-0000-000000000001')
--
--
--declare @userId varchar(36)
--set @userId='20000000-0000-0000-0000-000000000001'
--SELECT * FROM fly_im_Message m
--
--	LEFT JOIN fly_im_MessageRead us 
--	ON us.UserId=@userId AND m.SessionId=us.SessionId
--
--	WHERE m.SessionId IN(
--		SELECT Id FROM fly_im_Session s 
--			WHERE (Member1=@userId OR Member2=@userId) OR s.GroupId IN(
--				SELECT ID FROM dbo.fly_im_GetUserGroups(@userId)
--			))
--		AND (us.LastReadTime<m.Time OR us.LastReadTime IS NULL)

			





GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_GetLeaveCounts]'
GO










-- =============================================
-- Author:		Kuiyou
-- Create date: 2015-6-19
-- Description:	查询用户所有留言
-- =============================================
CREATE FUNCTION [dbo].[fly_im_GetLeaveCounts] 
(
	@userId varchar(50)
)
RETURNS TABLE 
AS
RETURN 
(
SELECT s.TargetType,
	   m.SessionId,
		(SELECT CASE 
				WHEN GroupId IS NOT NULL THEN GroupId 
				WHEN Member1 <> @userId THEN Member1 
				ELSE Member2 END
		FROM fly_im_Session session WHERE session.Id= m.SessionId ) AS Target,
		Count(1) AS Count
	FROM fly_im_Message m
	LEFT JOIN fly_im_Session s 
		ON m.SessionId=s.Id
	LEFT JOIN fly_im_UserSessionInfo us 
		ON us.UserId=@userId AND m.SessionId=us.SessionId

	WHERE ((s.Member1=@userId OR s.Member2=@userId) OR s.GroupId IN(
					SELECT ID FROM dbo.fly_im_GetUserGroupIds(@userId)
				)
			)
		AND (us.LastReadTime<m.Time OR us.LastReadTime IS NULL)
	GROUP BY s.TargetType, m.SessionId 
)

--
--select * from [fly_im_GetLeaveCounts]('20000000-0000-0000-0000-000000000001')
--
--
--declare @userId varchar(36)
--set @userId='20000000-0000-0000-0000-000000000001'
--
--
--SELECT s.TargetType,
--	   m.SessionId,
--		(SELECT CASE 
--				WHEN GroupId IS NOT NULL THEN GroupId 
--				WHEN Member1 <> @userId THEN Member1 
--				ELSE Member2 END
--		FROM fly_im_Session session WHERE session.Id= m.SessionId ) AS Target,
--		Count(1) AS Count
--	FROM fly_im_Message m
--	LEFT JOIN fly_im_Session s 
--		ON m.SessionId=s.Id
--	LEFT JOIN fly_im_MessageRead mr 
--		ON mr.UserId=@userId AND m.SessionId=mr.SessionId
--
--	WHERE ((s.Member1=@userId OR s.Member2=@userId) OR s.GroupId IN(
--					SELECT ID FROM dbo.fly_im_GetUserGroups(@userId)
--				)
--			)
--		AND (mr.LastReadTime<m.Time OR mr.LastReadTime IS NULL)
--	GROUP BY s.TargetType, m.SessionId 
--
--			







GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_GetRecentlySessions]'
GO








-- =============================================
-- Author:		Kuiyou
-- Create date: 2015-6-25
-- Description:	查询最近会话
-- =============================================
CREATE FUNCTION [dbo].[fly_im_GetRecentlySessions] 
(
	@userId varchar(50)
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT * FROM (
		SELECT s.Id,
				(SELECT TOP 1 m.Time FROM fly_im_Message m where m.SessionId = s.Id ) AS [Time],
				s.TargetType,
				Target =CASE WHEN s.GroupId IS NOT NULL THEN s.GroupId WHEN s.Member1 <> @userId THEN s.Member1 ELSE s.Member2 END
				FROM fly_im_Session s
								where ((s.Member1 = @userId OR s.Member2 = @userId) 
										OR EXISTS(SELECT * FROM dbo.fly_im_GetUserGroupIds(@userId) ug WHERE ug.Id = s.GroupId))
		) session 
)

--
--select * from GetRecentlySessions('20000000-0000-0000-0000-000000000001')
--
--


--declare @userId varchar(36)
--set @userId='20000000-0000-0000-0000-000000000001'
--
--	SELECT * FROM (
--		SELECT s.Id,
--				(SELECT TOP 1 m.Time FROM fly_im_Message m where m.SessionId = s.Id ) AS [Time],
--				s.TargetType,
--				Target =CASE WHEN s.GroupId IS NOT NULL THEN s.GroupId WHEN s.Member1 <> @userId THEN s.Member1 ELSE s.Member2 END
--				FROM fly_im_Session s
--								where ((s.Member1 = @userId OR s.Member2 = @userId) 
--										OR EXISTS(SELECT * FROM dbo.fly_im_GetUserGroups(@userId) ug WHERE ug.Id = s.GroupId))
--		) session 
--		WHERE Time IS NOT NULL 
--		ORDER BY Time DESC


GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Altering [dbo].[fBox_Work]'
GO
ALTER TABLE [dbo].[fBox_Work] ADD
[State] [int] NOT NULL CONSTRAINT [DF_fBox_Work_State] DEFAULT ((1))
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Altering [dbo].[fBox_WorkTarget]'
GO
ALTER TABLE [dbo].[fBox_WorkTarget] ADD
[State] [int] NOT NULL CONSTRAINT [DF_fBox_WorkTarget_State] DEFAULT ((1))
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_Follows]'
GO
CREATE TABLE [dbo].[fly_Follows]
(
[Id] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[UserId] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[InfoType] [varchar] (50) COLLATE Chinese_PRC_CI_AS NOT NULL,
[InfoId] [varchar] (60) COLLATE Chinese_PRC_CI_AS NOT NULL,
[Time] [datetime] NOT NULL
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_Follows UserId, InfoType, InfoId] on [dbo].[fly_Follows]'
GO
CREATE CLUSTERED INDEX [IX_fly_Follows UserId, InfoType, InfoId] ON [dbo].[fly_Follows] ([UserId], [InfoType], [InfoId])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating primary key [PK_fly_Follows] on [dbo].[fly_Follows]'
GO
ALTER TABLE [dbo].[fly_Follows] ADD CONSTRAINT [PK_fly_Follows] PRIMARY KEY NONCLUSTERED  ([Id])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fly_im_Group]'
GO
CREATE TABLE [dbo].[fly_im_Group]
(
[Id] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL,
[Name] [varchar] (50) COLLATE Chinese_PRC_CI_AS NOT NULL,
[Desc] [varchar] (200) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreateUserId] [varchar] (36) COLLATE Chinese_PRC_CI_AS NOT NULL
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating primary key [PK_fly_im_Group] on [dbo].[fly_im_Group]'
GO
ALTER TABLE [dbo].[fly_im_Group] ADD CONSTRAINT [PK_fly_im_Group] PRIMARY KEY CLUSTERED  ([Id])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
IF EXISTS (SELECT * FROM #tmpErrors) ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT>0 BEGIN
PRINT 'The database update succeeded'
COMMIT TRANSACTION
END
ELSE PRINT 'The database update failed'
GO
DROP TABLE #tmpErrors
GO