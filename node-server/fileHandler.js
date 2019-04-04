var fs = require("fs");
var path = require("path");

//已经被客户下载的图片，拷贝到目标文件夹
var targetDir ='C:\\lsn\\spicture_backup';
//文件操作是否出错标志位
var globalErrorFlag = false;

function fileHandler() {
};

fileHandler.prototype.transferFile =function(files) {
    globalErrorFlag = false;
    for(var i=0;i<files.length;i++){
        copyFile(files[i]);
        //deleteFile(files[i]);
    }
};

fileHandler.prototype.getErrorValue = function(){
    console.log("$$file handler error flag:"+globalErrorFlag);
    return  globalErrorFlag;
}

function copyFile(file){
     // 异步读取
fs.readFile(file, function (err, data) {
    if (err) {
        console.log(err);
        globalErrorFlag = true;
        return ;
    }else{
        console.log("异步读取: ");
        fs.writeFile(getTargetFile(targetDir,file),data,function(err){
            if(err){
                console.log(err);
                globalErrorFlag = true;
                return ;
            }
              
        });
    }
 });

};

function deleteFile(file){
    console.log('starting delete file......');
    fs.unlink(file,function(err){
          if(err){
            console.log(err);
            globalErrorFlag = true;
            return ;
          }else{
              console.log("delete "+file+'  success!');
          }
    });
}


function getTargetFile(targetDir,sourceFilePath){
    console.log("parse target file:........"+ targetDir+'/'+path.basename(sourceFilePath));
   return targetDir+'/'+path.basename(sourceFilePath);
}

module.exports = fileHandler;