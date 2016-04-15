//引入mongoose对象
var mongoose = require('mongoose');

var Role = mongoose.model('Role');
var Menu = mongoose.model('Menu');
var Auth = mongoose.model('Auth');

var _ = require('underscore');

exports.toAdd = function(req, res) {
	res.render('role/toadd');
}

exports.list = function(req, res) {
	Role
		.find({})
		.exec(function(err, roles) {
			if (err) {
				console.log(err);
			}
			res.render('role/role', {
				roles: roles
			});
		});
}
exports.showAuths = function(req, res) {
	var role_id = req.query._id;
	// req.session.user = user;
	Role
		.find({
			_id: role_id
		})
		.sort('order')
		.populate('menus', 'name')
		.populate('auths', 'name')
		.exec(function(err, role) {
			if (err) {
				console.log(err);
			}
			req.session.checkedRole = role;
		});
	// console.log(req.body);
	// console.log(req.params);
	// console.log(req.query);
	Menu
		.find({
			"rank": 1
		})
		.sort('order')
		.populate('childs', 'name icon order rank url meta.createAt meta.updateAt')
		// .populate('auths', 'name')
		.exec(function(err, menus) {
			if (err) {
				console.log(err);
			}
			var rolemenus = req.session.checkedRole.menus;
			// 如果角色中的栏目不为空
			if (rolemenus) {
				//循环所有栏目
				for (var i = 0; i < menus.length; i++) {
					//定义变量,用来判定此角色是否有对应的栏目
					var roleHas = false;
					//获取其中一个栏目的id
					var imenu_id = menus[i]._id;
					//循环角色中的权限
					for (var j = 0; j < rolemenus.length; i++) {
						//如果权限中的栏目有和当前栏目相同的值
						if (imenu_id == rolemenus[j]._id) {
							//说明此角色有对应栏目,值设置为true
							roleHas = true;
						}
					}
					//如果此角色有对应的栏目
					if (roleHas) {
						//角色在栏目中的备注字段设置成选中
						menus[i].role_remark = 'checked';
					} else {
						//否则则设置成不选中
						menus[i].role_remark = false;
					}
					// console.log(menus[i]);
				}
			}
			console.log(req.session.checkedRole);
			res.render('role/auths', {
				menus: menus
					// auths: auths,
					// role: role
					// rolemenus: rolemenus,
					// roleauths: roleauths
			});
			// for (var i = 0; i < menus.length; i++) {

			// 	var _childs = menus[i].childs;
			// 	_childs.sort(function(a, b) {
			// 		return a.order - b.order;
			// 	});
			// 	menus[i].childs = _childs;
			// };
			// Role
			// 	.find({
			// 		_id: role_id
			// 	})
			// 	.sort('order')
			// 	.populate('menus', 'name')
			// 	.populate('auths', 'name')
			// 	.exec(function(err, role) {
			// 		rolemenus = role.menus;
			// 		roleauths = role.auths;
			// 		// // body...
			// 		// console.log(role.menus);
			// 		// console.log(role.auths);
			// 		if (rolemenus) {
			// 			for (var i = 0; i < menus.length; i++) {
			// 				var roleHas = false;
			// 				var imenu_id = menus[i]._id;
			// 				for (var j = 0; j < rolemenus.length; i++) {
			// 					if (imenu_id == rolemenus[j]._id) {
			// 						roleHas = true;
			// 					}
			// 				}
			// 				if (roleHas) {
			// 					menus[i].role_remark = 'checked';
			// 				} else {
			// 					menus[i].role_remark = false;
			// 				}
			// 				// console.log(menus[i]);
			// 			}
			// 		}
			// 		res.render('role/auths', {
			// 			menus: menus
			// 				// auths: auths,
			// 				// role: role
			// 				// rolemenus: rolemenus,
			// 				// roleauths: roleauths
			// 		});
			// 	});
			// Auth
			// 	.find({
			// 		'menu': '570cf530952b4517107b4391'
			// 	})
			// 	.sort('order')
			// 	// .populate('menu', 'name')
			// 	.exec(function(err, auths) {
			// 	});
		});
}

// signup  用户注册路由
exports.add = function(req, res) {
	//通过body获取前台传入的role对象
	var _role = req.body.role;
	//使用findOne对数据库中role进行查找
	Role.findOne({
		name: _role.name
	}, function(err, role) {
		if (err) {
			// console.log(err);
			res.json({
				code: 500,
				data: 0,
				msg: "角色检测时出错"
			});
		}
		//如果用户名已存在
		if (role) {
			res.redirect('/role/list');
		} else {
			//数据库中没有该用户名，将其数据生成新的用户数据并保存至数据库
			role = new Role(_role); //生成用户数据
			role.save(function(err, role) {
				if (err) {
					res.json({
						code: 500,
						data: 0,
						msg: "角色保存时出错"
					});
				}
				res.redirect('/role/list');
			});
		}
	});
}

exports.update = function(req, res) {
	//通过body获取前台传入的权限对象
	var roleObj = req.body.role;
	// console.log(roleObj);
	//获取此权限对应的栏目的id
	var menu_id = req.body.menu_id;
	var id = roleObj._id;
	if (id != "" && id != undefined && id != null && id != NaN) {
		Role.findById(id, function(err, role) {
			if (err) {
				console.log(err);
			}
			_role = _.extend(role, roleObj);
			_role.save(function(err, role) {
				if (err) {
					// console.log(err)
					res.json({
						code: 500,
						data: 0,
						msg: "修改角色时出错"
					});
				}
			});
			res.redirect('/role/list');
		});
	} else {
		res.redirect('/role/list');
	}

}

exports.remove = function(req, res) {
	var data = req.body.data;
	var id = data._id;
	// var menu_id = data.data1;
	//如果权限所属的栏目id不为空
	//如果传入的权限的id不为空
	if (id) {
		Role.remove({
			_id: id
		}, function(err, cAuth, next) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "删除角色时执行删除方法出错"
				});
			}
			res.redirect('/role/list');
		})
	} else {
		res.redirect('/role/list');
	}
}