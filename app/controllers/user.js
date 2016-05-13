//引入mongoose对象
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Role = mongoose.model('Role');
var Company = mongoose.model('Company');
var Depart = mongoose.model('Depart');

exports.signinRequired = function(req, res, next) {
	var onlineUser = req.session.onlineUser;
	if (onlineUser) {}
	//如果用户不存在
	if (!onlineUser || onlineUser == '') {
		//转发到登陆页面
		res.redirect('/signin');
	} else {
		//如果用户存在,执行下一步
		next();
	}
}

exports.getUser = function(req, res) {
	var id = req.query.id;
	User
		.findOne({
			_id: id
		}, function(err, user) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: '获取用户出错'
				});
			} else {
				res.json({
					code: 200,
					data: user,
					msg: '获取用户成功'
				});
			}
		})
}
exports.list = function(req, res) {
	User
		.find({})
		.exec(function(err, users) {
			if (err) {
				console.log(err);
			}
			res.render('user/user', {
				users: users
			});
		});
}


exports.tosignin = function(req, res) {
	// console.log('进入用户登录的get请求');
	res.render('user/signin', {
		title: '123'
	});
}

// signin  用户登陆路由
exports.signin = function(req, res) {
	var _user = req.body.user || '';
	var username = _user.username || '';
	var pwd = _user.pwd;
	//查询用户对象
	User.findOne({
		username: username
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			// console.log('用户不存在');
			res.json({
				code: 500,
				data: 0,
				msg: "用户不存在"
			});
			//如果用户存在
		} else {
			//使用user实例方法对用户名密码进行比较
			user.comparePwd(pwd, function(err, isMatch) {
				if (err) {
					console.log(err);
				}
				//密码匹配
				if (isMatch) {


					// console.log('登陆成功了');
					if (user.meilVerify != 2) {
						// console.log(user.meilVerify != 2);
						var user_id = user._id;
						return res.json({
							code: 500,
							data: 10,
							msg: "用户通过邮箱未验证",
							user_id: user_id
						});
					}

					console.log(user.depart);
					//设置部门的名称
					if (user.depart && user.depart != '部门未设置') {
						Depart.findOne({
							_id: user.depart
						}, function(err, depart) {
							if (depart) {
								user.depart_remark = depart.name;
							}
						});
					}


					//登陆成功了
					req.session.onlineUser = user; //=============这里写入了user
					var possessMenus = new Array();
					var possessAuths = new Array();

					//获取此用户所拥有的角色集合
					var roles = user.roles;
					// console.log(roles);
					var countRoles = 1;
					if (roles && roles.length != 0) {
						// console.log('进入有role的判断');
						for (var m = 0; m < roles.length; m++) {
							//循环获取角色的id
							var role_id = roles[m];
							// console.log(m + "-------------");
							// 根据角色的id,获取角色对象
							Role
								.find({
									_id: role_id
								})
								.populate('menus', 'name')
								.populate('auths', 'name')
								.exec(function(err, iRoles) {
									if (err) {
										console.log(err);
									}
									// var thisMenus;
									// var thisAuths;
									// console.log(iRoles);
									if (iRoles && iRoles.length != 0) {
										var thisMenus = iRoles[0].menus;
										var thisAuths = iRoles[0].auths;
										for (var j = 0; j < thisMenus.length; j++) {
											possessMenus.push(thisMenus[j]._id.toString());
										};
										for (var j = 0; j < thisAuths.length; j++) {
											possessAuths.push(thisAuths[j]._id.toString());
										};
									}
									// console.log(roles.length);
									// console.log(m);
									req.session.possessMenus = possessMenus; //=============把栏目列表信息写入session
									req.session.possessAuths = possessAuths; //=============把权限列表信息写入session
									// console.log(roles.length);
									// console.log(countRoles);
									if (countRoles == roles.length) {

										res.json({
											code: 200,
											data: 1,
											msg: "登陆成功"
										});
									}
									countRoles++;
								});
						};
					} else {
						req.session.possessMenus = []; //=============把栏目列表信息写入session
						req.session.possessAuths = []; //=============把权限列表信息写入session
						res.json({
							code: 200,
							data: 1,
							msg: "登陆成功"
						});
					}
					// console.log(req.session.possessMenus);
					// console.log('=================');
				} else {
					//账户名和密码不匹
					res.json({
						code: 500,
						data: 0,
						msg: "用户名或密码错误"
					});
				}
			});
		}

	});
}
exports.tosignup = function(req, res) {
	res.render('user/signup', {
		title: '123'
	});
}

exports.logout = function(req, res) {
	delete req.session.onlineUser;
	delete req.session.possessMenus;
	delete req.session.possessAuths;
	res.redirect('/signin');
}

// signup  用户注册路由
exports.signup = function(req, res) {
	//通过body获取前台传入的user对象
	var _user = req.body.user;
	// console.log(_user);
	//使用findOne对数据库中user进行查找
	User.findOne({
		username: _user.username
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		//如果用户名已存在
		if (user) {
			return res.json({
				code: 500,
				data: 0,
				msg: '此用户已经存在'
			});
			// return res.redirect('/signin');
		} else {
			//数据库中没有该用户名，将其数据生成新的用户数据并保存至数据库
			user = new User(_user); //生成用户数据
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				// return res.json({
				// 	data: 1
				// });
				res.render('mail/verify', {
					user: user
				});
			});
		}
	});
}

//根据用户名检测用户是否存在
exports.isExist = function(req, res) {
	var username = req.body.username;
	// console.log(req.body);
	// console.log(username);
	User.findOne({
		username: username
	}, function(err, user) {
		if (err) {
			console.log(err);
			return res.json({
				code: 500,
				isexist: 1
			});
		}

		if (user) {
			// console.log(user);
			return res.json({
				code: 200,
				isexist: 1
			});
		} else {
			return res.json({
				code: 200,
				isexist: 0
			});
		}
	})
}


exports.edit = function(req, res) {
	// var userId = req.params.id;
	var userId = req.params.id;
	// console.log(userId);
	User
		.findOne({
			_id: userId
		})
		.populate('roles', 'name')
		.exec(function(err, user) {
			if (err) {
				console.log(err);
			}

			returnData(user);
		})

	function returnData(user) {
		Role
			.find({})
			.exec(function(err, roles) {
				if (err) {
					console.log(err);
				}

				aa(roles);
			});

		function aa(roles) {
			res.render('index', {
				pagetype: 1,
				user: user,
				iroles: user.roles,
				roles: roles
			});
		}
	}
}
exports.info = function(req, res) {
	// var userId = req.params.id;
	var userId = req.params.id;
	// var onlineUser = req.session.onlineUser;
	// var company = onlineUser.company;
	// console.log(onlineUser.company);
	User
		.findOne({
			_id: userId
		})
		.populate('roles', 'name')
		.exec(function(err, user) {
			if (err) {
				console.log(err);
			}
			checkCompany(user);
			// console.log(user);

		});

	function checkCompany(user) {
		var userCompany = user.company;
		Company
			.find({})
			.sort('order')
			.exec(function(err, companys) {
				if (err) {
					console.log(err);
				}
				for (var i = 0; i < companys.length; i++) {
					if (userCompany == companys[i]._id) {
						companys[i].company_remark = true;
					}
				}
				res.render('user/edit', {
					user: user,
					companys: companys
				});
			});
	}
}
exports.infoOnline = function(req, res) {
	var userId = req.session.onlineUser._id;
	// var userId = req.params.id;
	// var userId = req.params.id;
	// var onlineUser = req.session.onlineUser;
	// var company = onlineUser.company;
	// console.log(onlineUser.company);
	User
		.findOne({
			_id: userId
		})
		.populate('roles', 'name')
		.exec(function(err, user) {
			if (err) {
				console.log(err);
			}
			checkCompany(user);
			// console.log(user);

		});

	function checkCompany(user) {
		var userCompany = user.company;
		Company
			.find({})
			.sort('order')
			.exec(function(err, companys) {
				if (err) {
					console.log(err);
				}
				for (var i = 0; i < companys.length; i++) {
					if (userCompany == companys[i]._id) {
						companys[i].company_remark = true;
					}
				}
				res.render('user/edit', {
					user: user,
					companys: companys
				});
			});
	}
}
exports.roles = function(req, res) {
	var user_id = req.body._id;
	// console.log(user_id);
	User
		.find({
			_id: user_id
		})
		.sort('order')
		.populate('roles', 'name')
		// .populate('auths', 'name')
		.exec(function(err, user) {
			// console.log(user);
			if (err) {
				// console.log(err);
				res.json({
					code: 500,
					data: 0,
					msg: '获取用户角色时查询用户出错'
				});
			}
			// req.session.checkedUser = role[0];
			if (user) {
				var iroles = user[0].roles;
				Role
					.find({})
					.exec(function(err, roles) {
						// console.log(roles);
						if (err) {
							// console.log(err);
							res.json({
								code: 500,
								data: 0,
								msg: '获取用户角色时,list角色出错'
							});
						}
						if (roles) {
							for (var i = 0; i < roles.length; i++) {
								for (var j = 0; j < iroles.length; j++) {
									if (roles[i]._id.toString() == iroles[j]._id.toString()) {
										roles[i].role_remark = true;
									}
								};
							};
						}
						res.render('user/roles', {
							roles: roles
						});
					});
			} else {
				res.json({
					code: 500,
					data: 0,
					msg: '获取用户角色时,用户不存在'
				});
			}
		});
}

exports.addRole = function(req, res) {
	var user_id = req.body.user_id;
	var role_id = req.body.role_id;
	if (role_id) {
		Role.findOne({
			_id: role_id
		}, function(err, role) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "用户添加角色时,查询角色出错"
				});
			}
			if (user_id) {
				User.findOne({
					_id: user_id
				}, function(err, user) {
					// console.log(user);
					if (err) {
						res.json({
							code: 500,
							data: 0,
							msg: "用户添加角色时,查询用户出错"
						});
					}
					var iroles = user.roles;
					iroles.push(role._id);
					User
						.update({
							_id: user_id
						}, {
							roles: iroles
						}, function(err, iUser) {
							if (err) {
								res.json({
									code: 500,
									data: 0,
									msg: "用户添加角色时,保存用户出错"
								});
							}
						});
				});

			}
		});
	}
	res.json({
		code: 200,
		data: 0,
		msg: "用户添加角色成功"
	});
}

exports.removeRole = function(req, res) {
	var user_id = req.body.user_id;
	var role_id = req.body.role_id;
	User.findOne({
		_id: user_id
	}, function(err, user) {
		if (err) {
			res.json({
				code: 500,
				data: 0,
				msg: "角色删除权限时,查询角色出错"
			});
		}
		var roles = user.roles;
		for (var i = 0; i < roles.length; i++) {
			if (roles[i] && roles[i].toString() == role_id) {
				roles.splice(i, 1);
				User
					.update({
						_id: user_id
					}, {
						roles: roles
					}, function(err, iUser) {
						if (err) {
							res.json({
								code: 500,
								data: 0,
								msg: "用户添加角色时,保存用户出错"
							});
						}
					});
			}
		}
	});
	res.json({
		code: 200,
		data: 0,
		msg: "角色删除栏目成功"
	});
}
exports.update = function(req, res) {
	var user = req.body.user;
	// console.log(user);
	User
		.update({
			_id: user._id
		}, {
			realname: user.realname,
			company: user.company,
			position: user.position,
			depart: user.depart,
			phone: user.phone
		}, function(err, iUser) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "用户添加角色时,保存用户出错"
				});
			}
			res.redirect('/user/info' + user._id);

		});
	// res.json({
	// 	code: 200,
	// 	data: 0,
	// 	msg: "角色删除栏目成功"
	// });
}