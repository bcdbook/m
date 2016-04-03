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