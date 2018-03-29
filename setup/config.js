//请按标准的Json格式配置，使用UTF-8编码
({
    //网站配置
    site:
    {
        //网站名称
        name: '天禾企业云盘',
        //网站指向的目录（相对）
        path: '../web/',
        //程序使用的.NET Framework版本
        framework: 'v4.0',
        defaultPage: 'default.aspx'
    },
    im: { setupBat: "../im/win.server/install-run.bat" },
    //数据库配置
    db:
    {
        //SqlServer 实例名称
        sqlServerHost: '(local)',
        //数据库名称
        dbName: 'Fly.Box-DB',
        //数据库帐号
        userName: 'sa',
        //附加后数据库存储的路径（相对）
        toPath: '../db/',
        //用来附加的数据库文件（相对）
        mdf: '../db/Fly.Box-DB.mdf',
        ldf: '../db/Fly.Box-DB.ldf'
    },
    //配置
    configs: [{
        //配置文件路径（相对）
        file: '../web/web.config',
        conns: [{
            search: 'name\\s*=\\s*"fly-box"\\s+connectionString\\s*=\\s*"[^"]*"',
            replace: 'connectionString\\s*=\\s*"[^"]*"',
            valueFormat: 'connectionString="{0};Connect Timeout=5;multipleactiveresultsets=True;App=EntityFramework;"'
        }]
    },
    {
        //配置文件路径（相对）
        file: '../im/web/web.config',
        conns: [{
            search: 'name\\s*=\\s*"fly-box-im"\\s+connectionString\\s*=\\s*"[^"]*"',
            replace: 'connectionString\\s*=\\s*"[^"]*"',
            valueFormat: 'connectionString="{0};Connect Timeout=5;multipleactiveresultsets=True;App=EntityFramework;"'
        }]
    },
    {
        //配置文件路径（相对）
        file: '../im/win.server/exe/Fly.Box.IM.Serve.Win.exe.config',
        conns: [{
            search: 'name\\s*=\\s*"fly-box-im"\\s+connectionString\\s*=\\s*"[^"]*"',
            replace: 'connectionString\\s*=\\s*"[^"]*"',
            valueFormat: 'connectionString="{0};Connect Timeout=5;multipleactiveresultsets=True;App=EntityFramework;"'
        }]
    }]
})