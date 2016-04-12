//引入mongoose对象
var mongoose = require('mongoose');

var Auth = mongoose.model('Auth');
var Menu = mongoose.model('Menu');
var _ = require('underscore');

// exports.toAdd = function(req, res) {
// 	res.render('menu/toadd');
// }

exports.list = function(req, res) {
	var menuid = req.params.menuid;
	// console.log(menuid);
	Auth
		.find({
			"menu": menuid
		})
		.sort('order')
		.populate('menu', 'name')
		.exec(function(err, auths) {
			// console.log(auths);
			res.render('auth/au_list', {
				auths: auths
			});
		});
}

// 权限的添加
exports.add = function(req, res) {
	//通过body获取前台传入的权限对象
	var authObj = req.body.auth;
	//获取此权限对应的栏目的id
	var menu_id = req.body.menu_id;
	//生成用户数据
	var _auth = new Auth(authObj);
	// 执行权限的添加方法
	_auth.save(function(err, auth) {
		if (err) {
			res.json({
				code: 500,
				data: 0,
				msg: "权限保存时出错"
			});
		}
		// 查询权限对应的栏目
		Menu.findOne({
			_id: menu_id
		}, function(err, menu) {
			// 把对应的权限放到栏目中去
			menu.auths.push(auth._id);
			//对修改后的栏目执行保存
			menu.save(function(err, cMenu) {
				if (err) {
					res.json({
						code: 500,
						data: 0,
						msg: "权限保存到栏目中出错"
					});
				}
				res.redirect('/auth/list' + menu_id);
			});
		});
	});

}