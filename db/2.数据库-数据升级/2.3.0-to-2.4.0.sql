/*
	Fly.Box-2.3.0 数据升级至 Fly.Box-2.4.0

	2016-5-23 永兴科技
*/

UPDATE fBox_SpaceFile Set [Path] = dbo.fBox_BuildFileFullPath(Id)