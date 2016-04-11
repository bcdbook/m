//引入mongoose对象
var mongoose = require('mongoose');

var Auth = mongoose.model('Auth');
var Menu = mongoose.model('Menu');
var _ = require('underscore');

// exports.toAdd = function(req, res) {
// 	res.render('menu/toadd');
// }

// exports.list = function(req, res) {
// 	console.log("进入栏目的列表查询页面")
// 	Menu
// 		.find({
// 			"rank": 1
// 		})
// 		.sort('order')
// 		.populate('childs', 'name icon order rank url meta.createAt meta.updateAt')
// 		.exec(function(err, menus) {
// 			if (err) {
// 				console.log(err);
// 			}
// 			for (var i = 0; i < menus.length; i++) {

// 				var _childs = menus[i].childs;
// 				_childs.sort(function(a, b) {
// 					return a.order - b.order;
// 				});
// 				menus[i].childs = _childs;
// 			};
// 			res.render('menu/au_list', {
// 				menus: menus
// 			});
// 		});
// }

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