//引入mongoose对象
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Role = mongoose.model('Role');

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
	// signup  用户注册路由
exports.signup = function(req, res) {
	//通过body获取前台传入的user对象
	var _user = req.body.user;

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
				data: 0
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
				res.redirect('/user/list')
			});
		}
	});
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