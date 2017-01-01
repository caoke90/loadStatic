
/************************************/
var http = require('http');
var fs=require("fs")
var proxy=require("./proxy")
var url2path=require("url2path")
var path=require("path")
var zlib = require('zlib');
var Iconv = require('iconv-lite');
//创建文件夹
function mkdir(filepath){
    if(!fs.existsSync(path.dirname(filepath))){
        mkdir(path.dirname(filepath))
    }
    if(!fs.existsSync(filepath)){
        fs.mkdirSync(filepath)
    }
}
function url2realpath(href){
    var href=href.replace(/\?.+/,"")
    href=href.replace(/(https?:\/\/[\w\.]+\/[^/\.]+$)/i,"$1/")
    href=href.replace(/(\/[a-z0-9]+$)/i,"$1.html")
    var rpath=url2path.url2pathRelative(href);
    rpath=rpath.replace(/(\\.+?\\.+?\\.+?\\.+?\\.+?\\).+\\(.+)$/g,"$1$2")
    rpath=rpath.replace(/\\$/,"/index.html")
    rpath=rpath.replace(/\\/g,"/")
    rpath=rpath.replace(/http\/(.+?)\//,function(m,p1){
        var np1=p1.replace(/[a-z0-9\.]+\.([a-z0-9]+)\.[a-z]+/,"$1")
        return m.replace(p1,np1+"/"+p1)
    })
    return rpath
}
function getAllUrl(theUrl,html){
    var thefilePath=path.dirname(url2realpath(theUrl)).replace(/\\/g,"/")
    var doman,doman2,dir;
    theUrl.replace(/(^https?:\/\/[a-z0-9\.]+?\.([a-z0-9\.]+))(.*\/)/i,function(m,p1,p2,p3){
        doman=p1
        doman2=p2
        doman2=doman2.replace(/\.[a-z]+$/,"").replace(/[a-z]+\./,"")
        dir=p3
    })

    function solve(item){
        var url=item.oriUrl
        if(/^\/\//.test(url)){
            url="http:"+url
        }else if(/^\//.test(url)){
            url=doman+url
        }else if(!/^http/.test(url)){
            url=doman+dir+url
        }
        url=url.replace(/\/.\//g,"")
        url=url.replace(doman+"/../",doman+"/")
        item.absUrl=url

        var url=item.absUrl
        item.filePath=url2realpath(url).replace(/\\/g,"/")
        if(url.indexOf(doman2)>-1){
            item.relUrl=path.relative(item.thefilePath,item.filePath).replace(/\\/g,"/")
        }
        return item;
    }
    var dataUrl=[];//原始的url

    html=html.replace(/.+/g,function(line){
        line=line.replace(/([a-z]*)[ =]*["'=\(]([\w:\/\.]*\/[\w:\/\.\?#&=_-]+?)["'\) ]/gi,function(m,p1,url){
            if(p1!="type"){
                url=url.replace(/#.+/,"")
                if(url){
                    var item=solve({
                        thefilePath:thefilePath,
                        oriUrl:url
                    })
                    dataUrl.push(item)
                    if(item.relUrl){
                        m= m.replace(item.oriUrl,item.relUrl)
                    }
                }
            }
            return m;
        })
        line=line.replace(/([a-z]*)[ =]*["'=\(]([\w:\.\?#&=_-]+?)["'\) ]/gi,function(m,p1,url){
            if(p1=="href"||p1=="url"||p1=="src"){
                url=url.replace(/#.*/,"")
                if(url){
                    var item=solve({
                        thefilePath:thefilePath,
                        oriUrl:url
                    })
                    dataUrl.push(item)
                    if(item.relUrl){
                        m= m.replace(item.oriUrl,item.relUrl)
                    }
                }
            }
            return m;
        })
        return line;

    })
    return [html,dataUrl];
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

        if(headers["Content-Type"]&&headers["Content-Type"].indexOf("text")>-1){
            var body=buff.toString()
            if (/gb(2312|k)/i.test(headers['content-type'])||/<meta .*?charset=(["']?)gb(2312|k|18030)\1?/gi.test(body)||/encoding="gbk"/gi.test(body)) {
                body = Iconv.decode(buff, 'gb2312').toString()
                body=body.replace(/<meta .*?charset=(["']?)gb(2312|k|18030)\1?/gi,function(m){
                    return m.replace(/gb(2312|k|18030)/i,"utf-8")
                })
            }

            buff=UrltoRelaive(parsed.href,body)
        }

        fs.writeFileSync(filepath,buff)
    })
}
function UrltoRelaive(url,html){

    var dataUrl=getAllUrl(url,html)
    return dataUrl[0];
}
server.listen(100, function () {
    var port = server.address().port;
    console.log('HTTP(s) proxy server listening on port %d', port);
});
