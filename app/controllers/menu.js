//引入mongoose对象
var mongoose = require('mongoose');

var Menu = mongoose.model('Menu');
var _ = require('underscore');

// exports.toAdd = function(req, res) {
// 	res.render('menu/toadd');
// }

exports.list = function(req, res) {
	// console.log("进入栏目的列表查询页面")
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
			res.render('menu/menu', {
				menus: menus
			});
		});
}

// signup  用户注册路由
exports.add = function(req, res) {
	//通过body获取前台传入的menu对象
	var menuObj = req.body.menu;
	var parent_id = req.body.parent_id;
	// console.log(_menu);
	//数据库中没有该用户名，将其数据生成新的用户数据并保存至数据库
	var _menu = new Menu(menuObj); //生成用户数据
	//父级不存在,说明是一级栏目
	if (parent_id == '' || parent_id == undefined || parent_id == NaN || parent_id == null) {
		//直接执行添加
		_menu.save(function(err, menu) {
			if (err) {
				// console.log(err);
				res.json({
					code: 500,
					data: 0,
					msg: "添加栏目出错"
				});
			}
			console.log('栏目添加成功')
			res.redirect('/menu/list')
		});
	} else {
		//先保存二级栏目
		_menu.save(function(err, menu) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: "添加二级栏目出错"
				});
			}
			//根据一级的栏目id找到对应的栏目
			Menu.findOne({
					_id: parent_id
				},
				function(err, pMenu) {
					if (err) {
						res.json({
							code: 500,
							data: 0,
							msg: "查询一级栏目出错"
						});
					}
					//为一级栏目添加child
					pMenu.childs.push(menu._id);
					//保存一级栏目
					pMenu.save(function(err, cMenu) {
						if (err) {
							res.json({
								code: 500,
								data: 0,
								msg: "添加childen后保存一级栏目出错"
							});
						}
						res.redirect('/menu/list');
					})
				});
		});
	}
}
exports.update = function(req, res) {
	var menuObj = req.body.menu;
	var _menu;
	var id = menuObj._id; //获取菜单的id
	// console.log(menuObj);
	// var pid = menuObj.pid; //获取菜单的父级id
	if (id != "" && id != undefined && id != null && id != NaN) {
		// console.log('有对象')
		Menu.findById(id, function(err, menu) {
			if (err) {
				console.log(err);
			}
			_menu = _.extend(menu, menuObj);
			_menu.save(function(err, menu) {
				if (err) {
					console.log(err)
				}
			});
			res.redirect('/menu/list');
		});
		// return res.redirect('/menu/list');
	} else {
		res.redirect('/menu/list');
	}
}
exports.remove = function(req, res) {
	var data = req.body.data;
	var id = data._id;
	var pid = data.data2;
	var rank = data.data1;
	// console.log(id);
	// console.log(pid);
	// console.log(rank);
	// console.log('进入栏目删除');
	//如果被删除的是一级栏目
	if (rank == 1) {
		//直接执行删除
		if (id) {
			Menu.remove({
				_id: id
			}, function(err, cMenu) {
				if (err) {
					console.log(err);
				}
				res.redirect('/menu/list');
			});
		} else {
			res.redirect('/menu/list');
		}
	} else {
		//如果有父级id
		if (pid) {
			//先查询出父级
			Menu
				.findOne({
					_id: pid
				})
				.populate('childs', 'name')
				.exec(function(err, menu) {
					if (err) {
						console.log(err);
					}
					//如果有子集
					if (id) {
						//循环父级栏目的child对象
						var childs = menu.childs;
						for (var i = 0; i < childs.length; i++) {
							//如果child存在,并且其id和要删除的子id相同
							if (childs[i] && childs[i]._id.toString() == id) {
								//从栏目对象中去除掉当前的子对象
								childs.splice(i, 1);
								//保存一级栏目
								menu.save(function(err, _menu, next) {
									if (err) {
										console.log(err);
									}
								});
								//子集栏目执行删除
								Menu.remove({
									_id: id
								}, function(err, cMenu, next) {
									if (err) {
										console.log(err);
									}
								})
							}
						}
					}
				});
		}
		res.redirect('/menu/list');
	}
}
exports.hasChild = function(req, res) {
	var menu_id = req.body.menu_id;
	Menu.findOne({
		_id: menu_id
	}, function(err, menu) {
		console.log(menu);
		if (err) {
			res.json({
				code: 500,
				data: 0,
				msg: "查询栏目出错"
			});
		}
		if (menu.childs.length > 0) {
			res.json({
				code: 200,
				data: 1,
				msg: "此栏目有子集"
			});
		} else {
			res.json({
				code: 200,
				data: 0,
				msg: "此栏目没有子集"
			});
		}
	})
}

//修改排序的方法
exports.order = function(req, res) {
	var id = req.body._id;
	var order = req.body.order;
	Menu
		.update({
			_id: id
		}, {
			order: order
		}, function(err) {
			if (err) {
				// console.log(err);
				res.json({
					code: 500,
					data: 0,
					msg: "栏目排序时出错"
				});
			}
			res.json({
				code: 200,
				data: 1,
				msg: "栏目排序ok"
			});
		})
		// res.redirect('/menu/list');
}