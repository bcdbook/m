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
				.find()
				.sort('order')
				.populate('menu', 'name')
				.exec(function(err, auths) {
					// res.render('auth/au_list', {
					// 	auths: auths
					// });
					res.render('index', {
						menus: menus,
						auths: auths
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