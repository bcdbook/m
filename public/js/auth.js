// add_auth_modal
var auth = new Object();

$(function() {
	//添加权限时
	$(document).on('click', ".add_auth_modal", function() {
		// 获取当前权限列表的数量,加一后赋给顺序值
		var order = $(this).parents('.auth_box').first().find('dd.menu_item').length + 1;
		// console.log($(this).parents('.auth_box').first().find('dd.menu_item'));
		var menuId = $("#au_auth_hide_datas").data('para-mid');
		// console.log(order);
		// var order = 
		iutil.cleanInput('auth_menu_id', 'auth_todo', 'auth_id', 'auth_order', 'auth_name', 'auth_icon', 'auth_url');
		iutil.setInput({
			id: "auth_todo",
			val: 1
		}, {
			id: "auth_order",
			val: order
		}, {
			id: 'auth_menu_id',
			val: menuId
		});
		$("#au_auth").modal("toggle");
	});

	//修改权限时
	$(document).on('click', ".edit_auth_modal", function() {
		// // 获取当前权限列表的数量,加一后赋给顺序值
		// var order = $(this).parents('.auth_box').first().find('dd.menu_item').length + 1;
		// // console.log($(this).parents('.auth_box').first().find('dd.menu_item'));
		// var menuId = $("#au_auth_hide_datas").data('para-mid');
		// // console.log(order);
		// // var order =
		iutil.cleanInput('auth_menu_id', 'auth_todo', 'auth_id', 'auth_order', 'auth_name', 'auth_icon', 'auth_url');
		iutil.setInput({
			id: "auth_todo",
			val: 1
		}, {
			id: "auth_order",
			val: order
		}, {
			id: 'auth_menu_id',
			val: menuId
		});
		$("#au_auth").modal("toggle");
	});
});

// //传入参数的描述参数
// 	var id; //id值(如果传参数,id是必传值)
// 	var name; //name值,封装到对象中的属性值
// 	var labelType; //标签类型
// 	var dataType; //数据类型

auth.auAuths = function() {
	//获取执行什么操作
	var todo = $("#auth_todo").val();
	var url = todo == 1 ? '/auth/add' : '/auth/update';

	//获取栏目的id
	var menu_id = $("#auth_menu_id").val();

	//获取封装好的menu对象
	var auth = iutil.getObj({
		id: 'auth_menu_id',
		name: 'menu'
	}, {
		id: 'auth_order',
		name: 'order'
	}, {
		id: 'auth_name',
		name: 'name'
	}, {
		id: 'auth_icon',
		name: 'icon'
	}, {
		id: 'auth_url',
		name: 'url'
	}, {
		id: 'auth_remark',
		name: 'remark'
	});
	console.log(auth);
	console.log(menu_id);

	$.ajax({
		url: url,
		type: 'POST',
		data: {
			auth: auth,
			menu_id: menu_id
		},
		async: false,
		success: function(data) {
			cb(data);
		},
		error: function() {
			console.log('pathExcel error2')
		}
	});

	function cb(data) {
		if (data.code) {

		} else {
			$("#auth_au_container_box").html(data);
		}
	}
}
auth.getAuths = function(menuId) {
	var url = '/auth/list' + menuId;
	$("#au_auth_hide_datas").data('para-mid', menuId);
	// console.log($(this).prevAll('.hide_datas').first());
	// console.log($("#au_auth_hide_datas").data('para-mid'))
	$.ajax({
		url: url,
		type: 'GET',
		data: {

		},
		async: false,
		success: function(data) {
			// cb(data);
			$("#auth_au_container_box").html(data);
		},
		error: function() {
			console.log('pathExcel error2')
		}
	});
}

// menu.hasChild = function(menuId) {
// 	var hasChild = true;
// 	$.ajax({
// 		url: '/menu/haschild',
// 		type: 'POST',
// 		data: {
// 			menu_id: menuId
// 		},
// 		async: false,
// 		//- cache: false,
// 		//- contentType: false,
// 		//- processData: false,
// 		success: function(data) {

// 			cb(data);
// 		},
// 		error: function() {
// 			console.log('pathExcel error2')
// 		}
// 	});

// 	function cb(data) {
// 		if (data.code == 200 && data.data == 0) {
// 			hasChild = false;
// 		}
// 	}
// 	return hasChild;
// }
// menu.showMenus = function(data) {
// 	$("#inner_box").html(data);
// 	// console.log(data);
// }