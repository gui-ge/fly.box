/*
	Fly.Box-2.2.2 beta 升级至 Fly.Box-2.2.2

	2015-5-25 友百利
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
PRINT N'Dropping [dbo].[fBox_CheckSpaceFileUserACL]'
GO
DROP FUNCTION [dbo].[fBox_CheckSpaceFileUserACL]
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating [dbo].[fBox_CheckSpaceFileUserACL]'
GO

-- =============================================
-- Author:		友百利
-- Create date: 2014-6-24 
-- Description:	检测用户文件权限
-- 返回值 ：是否有权限
-- =============================================
CREATE FUNCTION [dbo].[fBox_CheckSpaceFileUserACL]
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
	--Open Or Download
	if(@checkAcl=-34) BEGIN
		if(dbo.[fBox_CheckSpaceFileUserACL](@spaceFileId,@userId,2)=1)
			return 1
		if(dbo.[fBox_CheckSpaceFileUserACL](@spaceFileId,@userId,32)=1)
			return 1
		return 0;
	END

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
PRINT N'Altering [dbo].[fBox_Shortcuts]'
GO
ALTER TABLE [dbo].[fBox_Shortcuts] ADD
[Remark] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Altering [dbo].[fly_KeyValue]'
GO
ALTER TABLE [dbo].[fly_KeyValue] ADD
[Id] [bigint] NOT NULL IDENTITY(1, 1)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating index [IX_fly_KeyValue] on [dbo].[fly_KeyValue]'
GO
CREATE CLUSTERED INDEX [IX_fly_KeyValue] ON [dbo].[fly_KeyValue] ([Key])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
PRINT N'Creating primary key [PK_fly_KeyValue] on [dbo].[fly_KeyValue]'
GO
ALTER TABLE [dbo].[fly_KeyValue] ADD CONSTRAINT [PK_fly_KeyValue] PRIMARY KEY NONCLUSTERED  ([Id])
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