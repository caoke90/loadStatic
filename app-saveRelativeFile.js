
/************************************/
var http = require('http');
var fs=require("fs")
var proxy=require("./proxy")
var url2path=require("url2path")
var path=require("path")
var zlib = require('zlib');
function UrltoRelaive(url,html){
    var url2=url.replace(/(https?:\/\/[\w\.]+\/[^/\.]+$)/i,"$1/")
    var doman,dir;
    url2.replace(/(^https?:\/\/[a-z\.]+)(.*\/)/i,function(m,p1,p2){
        doman=p1
        dir=p2
    })
    html=html.replace(/(["']|\()(.+?)(\1|\))/g,function(m,p1,url){
        if(url.indexOf(doman)==0){
            m=m.replace(doman,"")
        }
        if(/^\//.test(url)){
            m= m.replace(url,path.relative(dir, url).replace(/\\/g,"/"))
        }
        return m
    })
    return html
}
//创建文件夹
function mkdir(filepath){
    if(!fs.existsSync(path.dirname(filepath))){
        mkdir(path.dirname(filepath))
    }
    if(!fs.existsSync(filepath)){
        fs.mkdirSync(filepath)
    }
}
//url转成文件路径
function url2realpath(href){
    var href=href.replace(/\?.+/,"")
    href=href.replace(/(https?:\/\/[\w\.]+\/[^/\.]+$)/i,"$1/")
    var rpath=url2path.url2pathRelative(href);
    rpath=rpath.replace(/(\\.+?\\.+?\\.+?\\.+?\\.+?\\).+\\(.+)$/g,"$1$2")
    rpath=rpath.replace(/\\$/,"/index.html")
    return rpath
}


var server = proxy();
//请求开始的参数 parsed
//请求结束的参数 statusCode (状态)
//请求结束的参数 headers (header信息)
//请求结束的参数 proxyRes (内容的字符流)
server.httpParams=function(parsed,statusCode,headers,proxyRes){

    if(statusCode==200){
        var rpath=url2realpath(parsed.href)
        mkdir(path.dirname(rpath))
//        console.log(parsed)
//        console.log(statusCode)
//        console.log(headers)

        saveStream(rpath,parsed,statusCode,headers,proxyRes)
    }
    return proxyRes;
}
//保存字符流
function saveStream(filepath,parsed,statusCode,headers,proxyRes){
    var arr=[];
    proxyRes.on("data",function(buff){
        arr.push(buff)
    })
    proxyRes.on("end",function(){
        var buff=Buffer.concat(arr)
        if(headers["Content-Encoding"]=="gzip"){
            buff=zlib.gunzipSync(buff)
        }

        if(headers["Content-Type"].indexOf("text")>-1){
            buff=buff.toString()
            buff=UrltoRelaive(parsed.href,buff)
        }

        fs.writeFileSync(filepath,buff)
    })
}
server.listen(100, function () {
    var port = server.address().port;
    console.log('HTTP(s) proxy server listening on port %d', port);
});
