//引入mongoose对象
var mongoose = require('mongoose');

var Depart = mongoose.model('Depart');
var User = mongoose.model('User');
var _ = require('underscore');

// exports.toAdd = function(req, res) {
// 	res.render('Depart/toadd');
// }

exports.list = function(req, res) {
	// console.log("进入栏目的列表查询页面")
	var company_id = req.params.company_id;
	// console.log(req.)
	Depart
		.find({
			company: company_id
		})
		.sort('order')
		.exec(function(err, departs) {
			if (err) {
				console.log(err);
			}
			res.render('depart/au_list', {
				departs: departs
			});
		});

	// var departs = require('./depart.json').departs;
	// res.render('depart/au_list', {
	// 	departs: departs
	// });
}

exports.departs = function(req, res) {

	var company_id = req.body._id;
	var userId = req.body.user_id;

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
	// console.log(company_id);
	function checkCompany(user) {
		// body...
		Depart
			.find({
				company: company_id
			})
			.sort('order')
			.exec(function(err, departs) {
				if (err) {
					console.log(err);
				}
				var userDepart = user.depart;
				for (var i = 0; i < departs.length; i++) {
					// departs[i]
					if (userDepart == departs[i]._id) {
						departs[i].depart_remark = true;
					}
				}
				res.render('user/departs', {
					departs: departs
				});
				// res.json({
				// 	code: 200,
				// 	data: departs,
				// 	msg: '获取部门成功'
				// });
			});
	}
	// if (company_id && company_id != '' && company_id != undefined) {

	// } else {
	// 	res.json({
	// 		code: 500,
	// 		data: 0,
	// 		msg: '获取部门失败'
	// 	});
	// }
}

// 部门添加的路由
exports.add = function(req, res) {
	//通过body获取前台传入的depart对象
	var _depart = req.body.depart;
	var company = _depart.company;
	//使用findOne对数据库中depart进行查找
	Depart.findOne({
		name: _depart.name
	}, function(err, depart) {
		if (err) {
			// console.log(err);
			res.json({
				code: 500,
				data: 0,
				msg: "部门检测时出错"
			});
		}
		//如果部门名已存在
		if (depart) {
			res.redirect('/depart/list' + company);
		} else {
			//数据库中没有该部门名，将其数据生成新的部门数据并保存至数据库
			depart = new Depart(_depart); //生成部门数据
			depart.save(function(err, depart) {
				if (err) {
					res.json({
						code: 500,
						data: 0,
						msg: "部门保存时出错"
					});
				}
				res.redirect('/depart/list' + company);
			});
		}
	});
}

exports.update = function(req, res) {
	//通过body获取前台传入的部门对象
	var departObj = req.body.depart;
	var company = departObj.company;
	// console.log(departObj);
	// //获取此部门对应的栏目的id
	// var menu_id = req.body.menu_id;
	var id = departObj._id;
	if (id != "" && id != undefined && id != null && id != NaN) {
		Depart.findById(id, function(err, depart) {
			if (err) {
				console.log(err);
			}
			_depart = _.extend(depart, departObj);
			_depart.save(function(err, depart) {
				if (err) {
					// console.log(err)
					res.json({
						code: 500,
						data: 0,
						msg: "修改部门信息时出错"
					});
				}
			});
			res.redirect('/depart/list' + company);
		});
	} else {
		res.redirect('/depart/list' + company);
	}

}

exports.remove = function(req, res) {
	var data = req.body.data;
	// console.log(data);
	var id = data._id;
	var cid = data.data1;
	// var mid = data.mid;
	// var menu_id = data.data1;
	//如果权限所属的栏目id不为空
	//如果传入的权限的id不为空
	if (id) {
		Depart.remove({
			_id: id
		}, function(err, cAuth, next) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "删除部门时执行删除方法出错"
				});
			}
			res.redirect('/depart/list' + cid);
		})
	} else {
		res.redirect('/depart/list' + cid);
	}
}