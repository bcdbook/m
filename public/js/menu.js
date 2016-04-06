var menu = new Object();
// iutil.cleanInput = function() {
// 	for (var i = 0; i < arguments.length; i++) {
// 		$("#" + arguments[i]).val('');
// 	};
// }
// iutil.setInput = function() {
// 	var option; //传入的参数
// 	var id;
// 	var val;
// 	for (var i = 0; i < arguments.length; i++) {
// 		option = arguments[i];
// 		id = option.id;
// 		val = option.val;
// 		$("#" + id).val(val);
// 	};
// }
$(function() {
	$(document).on('click', ".add_menu_modal", function() {
		// console.log("tianjai")
		iutil.cleanInput('menu_todo', 'menu_rank', 'menu_parent', 'menu_order', 'menu_name', 'menu_icon', 'menu_url');
		iutil.setInput({
			id: "menu_todo",
			val: 1
		}, {
			id: "menu_rank",
			val: 1
		}, {
			id: "menu_order",
			val: 4
		});
	});
	$(document).on('click', '.add_menu_modal_child', function() {
		iutil.cleanInput('menu_todo', 'menu_rank', 'menu_parent', 'menu_order', 'menu_name', 'menu_icon', 'menu_url');
		iutil.setInput({
			id: "menu_todo",
			val: 1
		}, {
			id: "menu_rank",
			val: 2
		}, {
			id: "menu_order",
			val: 4
		});
	});
	// $(document).on('click', 'a', function() {
	// 	console.log('a标签点击');
	// })
})

// //传入参数的描述参数
// 	var id; //id值(如果传参数,id是必传值)
// 	var name; //name值,封装到对象中的属性值
// 	var labelType; //标签类型
// 	var dataType; //数据类型
menu.auMenus = function() {
	//获取执行什么操作
	var todo = $("#menu_todo").val();
	var url = todo == 1 ? '/menu/add' : '/menu/update';

	//获取封装好的menu对象
	var menu = iutil.getObj({
		id: 'menu_rank',
		name: 'rank'
	}, {
		id: 'menu_parent',
		name: 'parent'
	}, {
		id: 'menu_order',
		name: 'order'
	}, {
		id: 'menu_name',
		name: 'name'
	}, {
		id: 'menu_icon',
		name: 'icon'
	}, {
		id: 'menu_url',
		name: 'url'
	});

	$.ajax({
		url: url,
		type: 'POST',
		data: {
			menu: menu
		},
		async: false,
		//- cache: false,
		//- contentType: false,
		//- processData: false,
		success: function(data) {
			if (data.code == 200) {
				// window.location.href = "/";
				// cb(data);
			}
		},
		error: function() {
			console.log('pathExcel error2')
		}
	});
	console.log(menu);
	// body...
}