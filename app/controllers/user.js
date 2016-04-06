//引入mongoose对象
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Role = mongoose.model('Role');

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
			res.render('user/list', {
				users: users
			});
		});
}


exports.tosignin = function(req, res) {
	console.log('进入用户登录的get请求');
	res.render('user/signin', {
		title: '123'
	});
}

// signin  用户登陆路由
exports.signin = function(req, res) {
	// console.log('controller.signin==req.session.user')
	// console.log(req.session.user);

	// console.log('进入用户登录的post请求');
	var _user = req.body.user || '';
	var username = _user.username || '';
	var pwd = _user.pwd;
	// console.log('123================================');
	User.findOne({
		username: username
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			console.log('用户不存在');
			res.json({
				code: 500,
				data: 0,
				msg: "用户不存在"
			});
		}
		//使用user实例方法对用户名密码进行比较
		user.comparePwd(pwd, function(err, isMatch) {
			if (err) {
				console.log(err);
			}
			// console.log('isMatch');
			console.log(isMatch);
			//密码匹配
			if (isMatch) {
				// req.session.user = user;
				res.json({
					code: 200,
					data: 1,
					msg: "登陆成功"
				});

				// console.log('login success');
				// req.session.user = user; //将当前登录用户名保存到session中
			} else {
				//账户名和密码不匹
				res.json({
					code: 500,
					data: 0,
					msg: "用户名或密码错误"
				});
			}
			// res.redirect('/')
		});
	});
}
exports.tosignup = function(req, res) {
	res.render('user/signup', {
		title: '123'
	});
}

// signup  用户注册路由
exports.signup = function(req, res) {
		//通过body获取前台传入的user对象
		var _user = req.body.user;
		console.log(_user);
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