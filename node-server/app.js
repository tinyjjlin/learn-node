var express = require("express");
var path = require('path');
var proxy = require("express-http-proxy");
var bodyParser = require("body-parser");

var fileHandler = require("./fileHandler");

// 声明 服务器实例
var app = express();
var ip ="172.18.101.114"
var port = 8020;
var proxyPath = 'http://172.18.101.114:8021'

var img_resource_dir = 'C:/lsn/picture/p_0110'
var img_mark_dir ="../markImg";
var img_cut_dir ="../cutImg";

var apiProxy = proxy(proxyPath, {
    proxyReqPathResolver: function (req, res) {
        console.log(req._parsedUrl.path);
        return req._parsedUrl.path;
    }
});

app.use(bodyParser.json());  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({//此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));



app.use("/api", apiProxy);

// 访问静态资源
app.use(express.static(path.resolve(__dirname, '../web/dist')));
//访问图片资源
app.use('/img_resource',express.static(path.resolve(__dirname, img_resource_dir)));
app.use('/img_mark_res',express.static(path.resolve(__dirname, img_mark_dir)));
app.use('/img_cut_res',express.static(path.resolve(__dirname, img_cut_dir)));

app.post("/moveFile",function(req,res){
    let fileList = req.body.list;
    console.log("req body...."+fileList);
    if(fileList ===undefined || fileList === null || fileList.length <1){
        console.log("fileList.....1");
        res.send({"status":"bad","msg":"move file failed"});
    }else{
        let fileHandlerInstance = new fileHandler();
        fileHandlerInstance.transferFile(req.body.list);
        if(fileHandlerInstance.getErrorValue()){
            console.log("fileList.....2");
            res.send({"status":"bad","msg":"move file failed"});
        }else{
            console.log("fileList.....3");
            res.send({"status":"ok","msg":"move file success"});
        }

    }
        
    
});

// 移动图片

// 监听
app.listen(port, ip, function () {
    console.log('success listening...' + port);
});