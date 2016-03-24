var moment = require('moment');
var path = require('path');

//获取项目的根路径
exports.getRootDir = function() {
	return path.dirname(path.dirname(__dirname));
}


exports.getFileDir = function(fileName) {
	fileNameArr = fileName.split('.'); //根据.拆分文件名
	fileTypeIndex = fileNameArr.length - 1; //获取文件的后缀
	var fileType = fileNameArr[fileTypeIndex]; //获取文件的后缀名
	var backDir = '';
	var fileName = '';

	//判断文件的格式,并根据不同的格式选择不同的上传路径
	//注: 目前只区分了图片格式和其他格式
	if (fileType == 'bmp' || fileType == 'jpg' || fileType == 'tiff' || fileType == 'gif' || fileType == 'pcx' || fileType == 'tga' || fileType == 'exif' || fileType == 'fpx' || fileType == 'svg' || fileType == 'psd' || fileType == 'cdr' || fileType == 'pcd' || fileType == 'dxf' || fileType == 'ufo' || fileType == 'eps' || fileType == 'ai' || fileType == 'raw') {
		backDir = '/img'
	} else {
		backDir = '/files'
	}
	//创建时间对象,用来获取时间戳
	var d = new Date();
	var mathNum = Math.random() * 100;
	//根据日期生成每天的文件夹
	backDir += '/' + moment(d).format('YYYYMMDD');

	// 拼接以时间戳和随机数生成的文件名
	fileName += '/' + moment(d).format('YYYYMMDDHHmmssSSSS') + parseInt(mathNum);
	// 拼接后缀
	fileName += '.' + fileType;
	return {
		'fileDir': backDir,
		'fileName': fileName
	};
}