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
	// console.log(req.session.checkedRole);
	Auth
		.find({
			"menu": menuid
		})
		.sort('order')
		// .populate('menu', 'name')
		.exec(function(err, auths) {
			// console.log(auths);
			// console.log(auths);
			res.render('auth/au_list', {
				auths: auths
			});
		});
}
exports.auths = function(req, res) {
	// console.log('aaa');
	// console.log(req.session.checkedRole);
	var roleAuths = req.session.checkedRole.auths;
	var menuid = req.body._id;
	Auth
		.find({
			"menu": menuid
		})
		.sort('order')
		// .populate('menu', 'name')
		.exec(function(err, auths) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "栏目获取权限列表时出错"
				});
			}
			for (var i = 0; i < auths.length; i++) {
				auths[i].role_remark = true;
				for (var j = 0; j < roleAuths.length; j++) {
					if (auths[i]._id && roleAuths[j] && auths[i]._id.toString() == roleAuths[j]) {
						auths[i].role_remark = true;
					};
					// roleAuths[j]
				};
			}
			// console.log(auths);
			// console.log(auths);
			res.render('auth/auths', {
				auths: auths
			});
		});
}

// 权限的添加
exports.add = function(req, res) {
	//通过body获取前台传入的权限对象
	var authObj = req.body.auth;
	// console.log(authObj);
	//获取此权限对应的栏目的id
	var menu_id = req.body.menu_id;
	//生成用户数据
	var _auth = new Auth(authObj);
	// console.log(_auth);
	// 执行权限的添加方法
	_auth.save(function(err, auth) {
		if (err) {
			res.json({
				code: 500,
				data: 0,
				msg: "权限保存时出错"
			});
		}
		// console.log(auth);
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
exports.update = function(req, res) {
	//通过body获取前台传入的权限对象
	var authObj = req.body.auth;
	//获取此权限对应的栏目的id
	var menu_id = req.body.menu_id;
	var id = authObj._id;
	if (id != "" && id != undefined && id != null && id != NaN) {
		// console.log('有对象')
		Auth.findById(id, function(err, auth) {
			if (err) {
				console.log(err);
			}
			_auth = _.extend(auth, authObj);
			_auth.save(function(err, auth) {
				if (err) {
					// console.log(err)
					res.json({
						code: 500,
						data: 0,
						msg: "修改权限时出错"
					});
				}
			});
			// res.redirect('/auth/list');
			res.redirect('/auth/list' + menu_id);
		});
		// return res.redirect('/auth/list');
	} else {
		// res.redirect('/auth/list');
		res.redirect('/auth/list' + menu_id);
	}

}
exports.remove = function(req, res) {
	var data = req.body.data;
	var id = data._id;
	var menu_id = data.data1;
	//如果权限所属的栏目id不为空
	if (menu_id) {
		Menu
			.findOne({
				_id: menu_id
			})
			.populate('auths', 'name')
			.exec(function(err, menu) {
				if (err) {
					// console.log(err)
					res.json({
						code: 500,
						data: 0,
						msg: "删除权限时出错"
					});
				}
				//如果传入的权限的id不为空
				if (id) {
					if (menu) {
						var auths = menu.auths;
						for (var i = 0; i < auths.length; i++) {
							//如果child存在,并且其id和要删除的子id相同
							if (auths[i] && auths[i]._id.toString() == id) {
								//从栏目对象中去除掉当前的子对象
								auths.splice(i, 1);
								//保存一级栏目
								menu.save(function(err, _menu, next) {
									if (err) {
										res.json({
											code: 500,
											data: 0,
											msg: "删除权限时保存栏目出错"
										});
										// console.log(err);
									}
								});
								//子集栏目执行删除
								Auth.remove({
									_id: id
								}, function(err, cAuth, next) {
									if (err) {
										res.json({
											code: 500,
											data: 0,
											msg: "删除权限时执行删除方法出错"
										});
										// console.log(err);
									}
								})
							}
						}
					}
				}
			});
		res.redirect('/auth/list' + menu_id);
	} else {
		res.redirect('/auth/list' + menu_id);
	}
	// var rank = data.data1;
}

exports.order = function(req, res) {
	var id = req.body._id;
	var menu_id = req.body.menu;
	var order = req.body.order;
	Auth
		.update({
			_id: id
		}, {
			order: order
		}, function(err) {
			if (err) {
				// console.log(err);
				res.json({
					code: 500,
					data: 0,
					msg: "权限排序时出错"
				});
			}
			res.json({
				code: 200,
				data: 1,
				msg: "权限排序成功"
			});
		});
	// res.redirect('/auth/list' + menu_id);
	// res.redirect('/menu/list');
}