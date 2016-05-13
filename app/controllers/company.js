//引入mongoose对象
var mongoose = require('mongoose');

var Company = mongoose.model('Company');
var _ = require('underscore');

// exports.toAdd = function(req, res) {
// 	res.render('company/toadd');
// }

exports.list = function(req, res) {
	Company
		.find({})
		.sort('order')
		.exec(function(err, companys) {
			if (err) {
				console.log(err);
			}
			res.render('company/company', {
				companys: companys
			});
		});
}

// 公司添加的路由
exports.add = function(req, res) {
	//通过body获取前台传入的company对象
	var _company = req.body.company;
	//使用findOne对数据库中company进行查找
	Company.findOne({
		name: _company.name
	}, function(err, company) {
		if (err) {
			// console.log(err);
			res.json({
				code: 500,
				data: 0,
				msg: "公司检测时出错"
			});
		}
		//如果公司名已存在
		if (company) {
			res.redirect('/company/list');
		} else {
			//数据库中没有该公司名，将其数据生成新的公司数据并保存至数据库
			company = new Company(_company); //生成公司数据
			company.save(function(err, company) {
				if (err) {
					res.json({
						code: 500,
						data: 0,
						msg: "公司保存时出错"
					});
				}
				res.redirect('/company/list');
			});
		}
	});
}

exports.update = function(req, res) {
	//通过body获取前台传入的权限对象
	var companyObj = req.body.company;
	// console.log(companyObj);
	// //获取此权限对应的栏目的id
	// var menu_id = req.body.menu_id;
	var id = companyObj._id;
	if (id != "" && id != undefined && id != null && id != NaN) {
		Company.findById(id, function(err, company) {
			if (err) {
				console.log(err);
			}
			_company = _.extend(company, companyObj);
			_company.save(function(err, company) {
				if (err) {
					// console.log(err)
					res.json({
						code: 500,
						data: 0,
						msg: "修改公司信息时出错"
					});
				}
			});
			res.redirect('/company/list');
		});
	} else {
		res.redirect('/company/list');
	}

}

exports.remove = function(req, res) {
	var data = req.body.data;
	var id = data._id;
	// var menu_id = data.data1;
	//如果权限所属的栏目id不为空
	//如果传入的权限的id不为空
	if (id) {
		Company.remove({
			_id: id
		}, function(err, cAuth, next) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "删除公司时执行删除方法出错"
				});
			}
			res.redirect('/company/list');
		})
	} else {
		res.redirect('/company/list');
	}
}