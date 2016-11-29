
/************************************/
var http = require('http');
var fs=require("fs")
var proxy=require("./proxy")

var server = proxy();
//请求开始的参数 parsed
//请求结束的参数 statusCode (状态)
//请求结束的参数 headers (header信息)
//请求结束的参数 proxyRes (内容的字符流)
server.httpParams=function(parsed,statusCode,headers,proxyRes){
//        console.log(parsed)
//        console.log(statusCode)
//        console.log(headers)
    return proxyRes;
}

server.listen(100, function () {
    var port = server.address().port;
    console.log('HTTP(s) proxy server listening on port %d', port);
});
