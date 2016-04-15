var mongoose = require('mongoose');
// var User = mongoose.model('User');
var User = mongoose.model('User');
var Role = mongoose.model('Role');
var Menu = mongoose.model('Menu');
var Auth = mongoose.model('Auth');

exports.index = function(req, res) {
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
			for (var i = 0; i < menus.length; i++) {

				var _childs = menus[i].childs;
				_childs.sort(function(a, b) {
					return a.order - b.order;
				});
				menus[i].childs = _childs;
			};
			Auth
				.find({
					'menu': '570cf530952b4517107b4391'
				})
				.sort('order')
				// .populate('menu', 'name')
				.exec(function(err, auths) {
					// res.render('auth/au_list', {
					// 	auths: auths
					// });
					Role
						.find({})
						.exec(function(err, roles) {
							if (err) {
								console.log(err);
							}
							// res.render('role/list', {
							// 	roles: roles
							// });
							res.render('index', {
								menus: menus,
								auths: auths,
								roles: roles
							});
						});
				});
		});
	// var roles;
	// Role
	// 	.find({})
	// 	.exec(function(err, roles) {
	// 		if (err) {
	// 			console.log(err);
	// 		}

	// 		// rendRole(roles);

	// 		// console.log(roles);
	// 		// roles = roles;
	// 		// console.log(roles)
	// 		// var user = {};
	// 		res.render('index', {
	// 			pagetype: 0,
	// 			roles: roles,
	// 			user: {}
	// 		});
	// 	});
	// console.log('roles=================')
	// function rendRole(roles) {

	// }

}