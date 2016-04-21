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
	var role_id = req.params._id;
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
			req.session.checkedRole = role[0];
		});
	Menu
		.find({
			"rank": 1
		})
		.sort('order')
		.populate('childs', 'role_remark name icon order rank url meta.createAt meta.updateAt')
		.exec(function(err, menus) {
			if (err) {
				console.log(err);
			}
			var rolemenus = req.session.checkedRole.menus;
			// 如果角色中的栏目不为空
			if (rolemenus) {
				//循环所有栏目
				for (var i = 0; i < menus.length; i++) {
					//获取栏目的子集
					var childs = menus[i].childs;
					//循环栏目的自己,用来查看此权限所拥有的栏目
					for (var c = 0; c < childs.length; c++) {
						//循环权限中拥有的栏目,与栏目的子集进行对比
						for (var j = 0; j < rolemenus.length; j++) {
							//如果权限的栏目集合中有对应的栏目
							if (childs[c]._id.toString() == rolemenus[j]._id.toString()) {
								//此栏目的选中对象设置成true
								childs[c].role_remark = true;
								// console.log(childs[c]);
							}
						}
					}
					for (var j = 0; j < rolemenus.length; j++) {
						if (menus[i]._id.toString() == rolemenus[j]._id.toString()) {
							menus[i].role_remark = true;
							// console.log(menus[i])
						}
					}
				}
			}
			res.render('role/auths', {
				menus: menus
			});
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
exports.addMenu = function(req, res) {
	var role_id = req.body.role_id;
	var menu_id = req.body.menu_id;
	if (menu_id) {
		Menu.findOne({
			_id: menu_id
		}, function(err, menu) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "角色添加栏目时,查询栏目出错"
				});
			}
			Role.findOne({
				_id: role_id
			}, function(err, role) {
				if (err) {
					res.json({
						code: 500,
						data: 0,
						msg: "角色添加权限时,查询角色出错"
					});
				}
				role.menus.push(menu._id);
				role.save(function(err, iRole) {
					if (err) {
						res.json({
							code: 500,
							data: 0,
							msg: "角色添加权限时,保存角色出错"
						});
					}
					req.session.checkedRole = iRole;
				})
			});
		});
	}
	res.json({
		code: 200,
		data: 0,
		msg: "角色添加栏目成功"
	});
	// res.redirect('/role/showauths' + role_id);
}

exports.removeMenu = function(req, res) {
	var role_id = req.body.role_id;
	var menu_id = req.body.menu_id;
	Role.findOne({
		_id: role_id
	}, function(err, role) {
		if (err) {
			res.json({
				code: 500,
				data: 0,
				msg: "角色删除权限时,查询角色出错"
			});
		}
		// console.log(role);
		var menus = role.menus;
		for (var i = 0; i < menus.length; i++) {
			// console.log('menus[i]')
			// console.log(menus[i]);
			if (menus[i] && menus[i].toString() == menu_id) {
				//
				menus.splice(i, 1);
				role.save(function(err, iRole) {
					if (err) {
						res.json({
							code: 500,
							data: 0,
							msg: "角色删除权限时,保存角色出错"
						});
					}
					req.session.checkedRole = iRole;
					// console.log(iRole);
				});
				// _role = _.extend(role, roleObj);
			}
		}
	});
	// console.log('removemenu');
	// console.log(role_id);
	// console.log(menu_id);
	res.json({
		code: 200,
		data: 0,
		msg: "角色删除栏目成功"
	});
	// res.redirect('/role/showauths' + role_id);
}

exports.addAuth = function(req, res) {
	var role_id = req.body.role_id;
	var auth_id = req.body.auth_id;
	if (auth_id) {
		Auth.findOne({
			_id: auth_id
		}, function(err, auth) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "角色添加栏目时,查询栏目出错"
				});
			}
			Role.findOne({
				_id: role_id
			}, function(err, role) {
				if (err) {
					res.json({
						code: 500,
						data: 0,
						msg: "角色添加权限时,查询角色出错"
					});
				}
				role.auths.push(auth._id);
				role.save(function(err, iRole) {
					if (err) {
						res.json({
							code: 500,
							data: 0,
							msg: "角色添加权限时,保存角色出错"
						});
					}
					req.session.checkedRole = iRole;
				})
			});
		});
	}
	res.json({
		code: 200,
		data: 0,
		msg: "角色添加栏目成功"
	});
}
exports.removeAuth = function(req, res) {
	// var role_id = req.body.role_id;
	// var auth_id = req.body.auth_id;
	var role_id = req.body.role_id;
	var auth_id = req.body.auth_id;
	Role.findOne({
		_id: role_id
	}, function(err, role) {
		if (err) {
			res.json({
				code: 500,
				data: 0,
				msg: "角色删除权限时,查询角色出错"
			});
		}
		// console.log(role);
		var auths = role.auths;
		for (var i = 0; i < auths.length; i++) {
			// console.log('auths[i]')
			// console.log(auths[i]);
			if (auths[i] && auths[i].toString() == auth_id) {
				//
				auths.splice(i, 1);
				role.save(function(err, iRole) {
					if (err) {
						res.json({
							code: 500,
							data: 0,
							msg: "角色删除权限时,保存角色出错"
						});
					}
					req.session.checkedRole = iRole;
					// console.log(iRole);
				});
				// _role = _.extend(role, roleObj);
			}
		}
	});
	// console.log('removeauth');
	// console.log(role_id);
	// console.log(auth_id);
	res.json({
		code: 200,
		data: 0,
		msg: "角色删除栏目成功"
	});


	// console.log('removeAuth');
	// console.log(role_id);
	// console.log(auth_id);
	// res.json({
	// 	code: 200,
	// 	data: 0,
	// 	msg: "删除角色成功"
	// });
}