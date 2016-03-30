//引入mongoose对象
var mongoose = require('mongoose');

var Role = mongoose.model('Role');

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
			res.render('role/list', {
				roles: roles
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
			console.log(err);
		}
		//如果用户名已存在
		if (role) {
			return res.json({
				data: 0
			});
			// return res.redirect('/signin');
		} else {
			//数据库中没有该用户名，将其数据生成新的用户数据并保存至数据库
			role = new Role(_role); //生成用户数据
			role.save(function(err, role) {
				if (err) {
					console.log(err);
				}
				// return res.json({
				// 	data: 1
				// });
				res.redirect('/role/list')
			});
		}
	});
}