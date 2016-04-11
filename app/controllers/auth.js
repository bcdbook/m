//引入mongoose对象
var mongoose = require('mongoose');

var Auth = mongoose.model('Auth');
var Menu = mongoose.model('Menu');
var _ = require('underscore');

// exports.toAdd = function(req, res) {
// 	res.render('menu/toadd');
// }

exports.list = function(req, res) {
	Auth
		.find()
		.sort('order')
		.populate('menu', 'name')
		.exec(function(err, auths) {
			res.render('auth/au_list', {
				auths: auths
			});
		});
}

// signup  用户注册路由
exports.add = function(req, res) {
	//通过body获取前台传入的menu对象
	var authObj = req.body.auth;
	var menu_id = req.body.menu_id;
	//数据库中没有该用户名，将其数据生成新的用户数据并保存至数据库
	var _auth = new Auth(authObj); //生成用户数据
	_auth.save(function(err, auth) {
		if (err) {
			console.log(err);
		}
		// console.log('添加权限成功');
		Menu.findOne({
			_id: menu_id
		}, function(err, menu) {
			// console.log(auth);
			menu.auths.push(auth._id);
			menu.save(function(err, cMenu) {
				if (err) {
					res.json({
						code: 500,
						data: 0,
						msg: "权限保存到栏目中出错"
					});
				}
				res.json({
					code: 200,
					data: 1,
					msg: "权限保存到栏目成功"
				});
			});
			// cb(err, menu);
		});
	});

}