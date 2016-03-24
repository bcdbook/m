// 20160324135110319037. xlsx
var xlsx = require('node-xlsx');
var fs = require('fs')
var IUtil = require('../util/util')

exports.topath = function(req, res) {
	res.render('pathexcel/pathexcel', {
		title: 1
	})
}
exports.pathexcel = function(req, res) {
	var url = IUtil.getRootDir() + '/public/uploads/files/11.xlsx';
	// var obj = xlsx.parse(__dirname + '/11.xlsx')
	var obj = xlsx.parse(fs.readFileSync(url));
	// console.log('obj:');
	// console.log(obj);
	// console.log('obj[0].name:');
	// console.log(obj[0].name);
	// console.log('obj[0].data:');
	console.log(obj[0].data);
	res.json({
		code: 200,
		msg: {
			url: '解析excel完成'
		}
	});
}

exports.exportExcel = function(req, res) {
	var url = __dirname + '/bbb.xlsx';
	var data = [
		[1, 2, 3],
		['name', 'age', 'sex'],
		['mason', 18, 1]
	];
	var buffer = xlsx.build([{
		name: "myexcel",
		data: data
	}]);
	fs.writeFileSync(url, buffer, 'binary');
	res.json({
		code: 200,
		msg: {
			url: '生成excel完成'
		}
	});
}