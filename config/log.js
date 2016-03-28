//日志相关配置开始******************************
//多文件处理的插件
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');

var iutil = require('../app/util/util');
// console.log(iutil.getRootDir());
//定义log文件存放的位置
var logDir = iutil.getRootDir() + '/logs' + '/' + iutil.getYearMonth('YYYYMM');
//检查路径是否存在,如果不存在则创建此路径
fs.existsSync(logDir) || fs.mkdirSync(logDir);
// create a rotating write stream 
//创建一个log的配置对象
var accessLogStream = FileStreamRotator.getStream({
	date_format: 'YYYYMMDD',
	filename: logDir + '/access-%DATE%.log',
	frequency: 'daily',
	verbose: false
});
// setup the logger 

var logconfig = '{"date[format]": ":date[format]","http-version": ":http-version","method": ":method","referrer": ":referrer","remote-addr": ":remote-addr","remote-user": ":remote-user","req[header]": ":req[header]","res[header]": ":res[header]","response-time[digits]": ":response-time[digits]","status": ":status","url": ":url","user-agent": ":user-agent"},';
//开启日志服务
module.exports = function(app) {
	app.use(morgan(logconfig, {
		stream: accessLogStream
	}));
}

//日志相关配置结束******************************