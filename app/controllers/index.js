var mongoose = require('mongoose');
// var User = mongoose.model('User');
var User = mongoose.model('User');
var Role = mongoose.model('Role');
var Menu = mongoose.model('Menu');
var Auth = mongoose.model('Auth');

exports.index = function(req, res) {
	var onlineUser = req.session.onlineUser;
	var possessMenus = req.session.possessMenus;
	// console.log(possessMenus);
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

			if (onlineUser.username == 'lason') {
				systemSignin(menus, function(menus) {
					res.render('index', {
						menus: menus
					});
				})

			} else {
				// console.log(menus);
				siftMenus(menus, function(menus) {
					// console.log('========================');
					// console.log(aa);
					for (var i = 0; i < menus.length; i++) {
						// console.log('-------------------执行排序')
						var _childs = menus[i].childs;
						_childs.sort(function(a, b) {
							return a.order - b.order;
						});
						menus[i].childs = _childs;
					};
					res.render('index', {
						menus: menus
					});
				});
			}
		});

	function siftMenus(menus, next) {
		//循环查询出从一级栏目
		var needSpliceParent = new Array();
		for (var i = 0; i < menus.length; i++) {
			//获取一级栏目中的子集
			var childs = menus[i].childs;
			//创建一个数组,用来存储需要删除的子集对象的下标
			var needSplice = new Array();
			var possessParent = false;
			//循环子集对象
			for (var j = 0; j < childs.length; j++) {
				// 子集栏目的id
				//定义一个变量,用来标识其中一个栏目是否应该显示
				var possess = false;
				//把循环的子集对象跟session中用户所含有的栏目对象进行比对
				for (var m = 0; m < possessMenus.length; m++) {
					//如果session中用户含有此对象
					if (possessMenus[m] == childs[j]._id.toString()) {
						//把标识值设置成true
						possess = true;
					}
				};
				//如果session中没有对应的栏目对象
				if (!possess) {
					//把子集栏目的下标放入需要删除的标识集合中
					needSplice.push(j);
				}
			};
			//删除没有选中的栏目子集
			for (var n = needSplice.length - 1; n >= 0; n--) {
				childs.splice(needSplice[n], 1);
			};


			for (var m = 0; m < possessMenus.length; m++) {
				//如果session中用户含有此对象
				if (possessMenus[m] == menus[i]._id.toString()) {
					//把标识值设置成true
					possessParent = true;
				}
			};
			if (!possessParent) {
				needSpliceParent.push(i);
			}
		};
		// console.log(needSpliceParent);
		//删除没有选中的栏目子集
		for (var x = needSpliceParent.length - 1; x >= 0; x--) {
			menus.splice(needSpliceParent[x], 1);
		};
		next(menus);
	}

	function systemSignin(menus, next) {
		for (var i = 0; i < menus.length; i++) {
			var _childs = menus[i].childs;
			_childs.sort(function(a, b) {
				return a.order - b.order;
			});
			menus[i].childs = _childs;
		};
		var possessAuths = new Array();
		Auth
			.find({})
			.exec(function(err, auths) {
				if (err) {
					console.log(err);
					res.render('user/signin', {
						title: '123'
					});
				}
				for (var i = 0; i < auths.length; i++) {
					possessAuths.push(auths[i]._id);
				};
				req.session.possessAuths = possessAuths;
				// setAuths(auths);
				next(menus);
			});
	}
}