var mongoose = require('mongoose');
// var User = mongoose.model('User');
var User = mongoose.model('User');
var Role = mongoose.model('Role');

exports.index = function(req, res) {
	// var roles;
	Role
		.find({})
		.exec(function(err, roles) {
			if (err) {
				console.log(err);
			}

			// rendRole(roles);

			// console.log(roles);
			// roles = roles;
			// console.log(roles)
			// var user = {};
			res.render('index', {
				pagetype: 0,
				roles: roles,
				user: {}
			});
		});
	// console.log('roles=================')
	// function rendRole(roles) {

	// }

}

exports.tosignin = function(req, res) {

	res.render('user/signin', {
		title: '123'
	});
}

// signin  用户登陆路由
exports.signin = function(req, res) {
	// console.log('controller.signin==req.session.user')
	// console.log(req.session.user);

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
			return res.json({
				data: 0
			});
		}
		//使用user实例方法对用户名密码进行比较
		user.comparePwd(pwd, function(err, isMatch) {
			if (err) {
				console.log(err);
			}
			// console.log('isMatch');
			// console.log(isMatch);
			//密码匹配
			if (isMatch) {
				req.session.user = user;
				return res.json({
					data: 1
				});

				// console.log('login success');
				// req.session.user = user; //将当前登录用户名保存到session中
			} else {
				//账户名和密码不匹
				return res.json({
					data: 0
				});
			}
			res.redirect('/')
		});
	});
}