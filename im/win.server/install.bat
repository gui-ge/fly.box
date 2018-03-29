cd /d %~dp0

net stop Fly_Box_IM
instsrv.exe Fly_Box_IM remove

regedit /s x.reg
instsrv.exe Fly_Box_IM %cd%\srvany.exe
net start Fly_Box_IM