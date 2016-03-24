var iutil = require('../util/util')

//进入上传页面的的方法
exports.toupload = function(req, res) {
	res.render('fileupload/toupload', {
		// title: "首页"
	});
}

var multiparty = require('multiparty')
var fs = require('fs')
var util = require('util');

var path = require('path');


exports.upload = function(req, res) {
	var oldPath = '';
	var newPath = '';
	// var dirName = __dirname.substring(0, __dirname.length - 16) + '/public/uploads';
	// 通过multiparty创建form对象
	var form = new multiparty.Form()
	form.on('error', function(err) {
		console.log('Error parsing form: ' + err.stack);
	});

	form.on('file', function(name, file) {
		oldPath = file.path;
		//拼接想要上传到的路径
		var rootDir = iutil.getRootDir(); //获取项目根路径
		//通过getFileDir方法获取文件存放的相对路径和文件名
		var fileVal = iutil.getFileDir(file.originalFilename);
		// 拼接文件存放的路径
		var fileDir = '/public/uploads' + fileVal.fileDir;
		//获取文件名
		// var fileName = fileVal.fileName;
		// 生成文件路径
		var newPath = rootDir + fileDir;
		//检测文件路径是否存在,如果不存在则生成一个
		fs.existsSync(newPath) || fs.mkdirSync(newPath);
		newPath += fileVal.fileName;
		// newPath = dirName + iutil.getFileDir(file.originalFilename);

		//重命名为真实文件名
		fs.rename(oldPath, newPath, function(err) {
			if (err) {
				console.log('rename error: ' + err);
			} else {
				console.log('rename ok');
			}
		});

		// res.json({
		// 	code: 200,
		// 	msg: {
		// 		url: newPath
		// 	}
		// });
		res.redirect('/toupload');
	})

	form.on('close', function() {
		console.log('Upload completed!');
		res.json({
			code: 200,
			msg: {
				// url: 'http://' + req.headers.host
				url: newPath
			}
		});
	});
	// Parse req 
	form.parse(req);
}



exports.ajaxupload = function(req, res) {
	//get filename
	// 获取文件名
	var filename = req.files.inputFile.originalFilename || path.basename(req.files.files.ws.path);
	var oldPath = req.files.inputFile.path;
	//拼接想要上传到的路径
	var rootDir = iutil.getRootDir();
	//通过getFileDir方法获取文件存放的相对路径和文件名
	var fileVal = iutil.getFileDir(filename);
	var fileDir = '/public/uploads' + fileVal.fileDir;
	// 对拼接的路径进行进一步的处理
	var newPath = rootDir + fileDir;
	//检测文件路径是否存在,如果不存在则生成一个
	fs.existsSync(newPath) || fs.mkdirSync(newPath);
	newPath += fileVal.fileName;
	// 执行移动文件的方法
	fs.rename(oldPath, newPath, function(err) {
		if (err) {
			console.log('rename error: ' + err);
		} else {
			console.log('rename ok');
		}
	});

	res.json({
		code: 200,
		msg: {
			url: fileDir
		}
	});
}