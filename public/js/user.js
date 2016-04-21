var jsuser = new Object();

$(function() {
	$(document).on('click', '.user_set_role_modal', function() {
		// 清理之前的模态框中的数据
		iutil.cleanInput('user_name');
		//获取数据对象(隐藏对象)
		var dataSpan = $(this).prevAll('span').first();
		var user = iutil.getDatas(dataSpan, {
			dataName: 'para-_id',
			objName: '_id'
		}, {
			dataName: 'para-username',
			objName: 'username'
		}, {
			dataName: 'para-remark',
			objName: 'remark'
		});
		// console.log(user);
		iutil.setInput({
			id: "user_username",
			val: user.username
		});
		$('#user_set_role_hide_datas').data('para-_id', user._id);
		console.log();
		var user_id = user._id;
		jsuser.getRoles(user_id);
		// console.log($('#user_set_role_hide_datas').data('para-_id'));
		$("#user_set_role").modal("toggle");
	});
	$(document).on('click', '#user_roles_list a', function() {
		var user_id = $('#user_set_role_hide_datas').data('para-_id');
		var role_id = $(this).data('role_id');
		var has_checked = $(this).data('has_checked');
		//如果用户有此角色
		if (has_checked) {
			//从后台删除用户中拥有的角色
			jsuser.removeRole(user_id, role_id);
			//删除角色被选中的样式
			$(this).removeClass('auth_checked');
			//角色被选中的标识设置成false
			$(this).data('has_checked', false);
		} else {
			//如果用户没有此角色
			//执行方法,把此角色添加到用户中
			jsuser.addRole(user_id, role_id);
			//添加前台被选中的样式
			$(this).addClass('auth_checked');
			//设置被选中标识字段为true
			$(this).data('has_checked', true);
		}
		// console.log(user_id);
		// console.log(role_id);
		// console.log('点击角色');
	})
});

jsuser.getRoles = function(user_id) {
	$.ajax({
		url: '/user/roles',
		type: 'POST',
		data: {
			_id: user_id
		},
		async: false,
		//- cache: false,
		//- contentType: false,
		//- processData: false,
		success: function(data) {
			// console.log(data);
			cb(data);
		},
		error: function() {
			console.log('用户获取角色集合出错');
		}
	});

	function cb(data) {
		$("#user_roles_list").html(data);
	}
}
jsuser.addRole = function(user_id, role_id) {
	$.ajax({
		url: '/user/addrole',
		type: 'POST',
		data: {
			user_id: user_id,
			role_id: role_id
		},
		async: false,
		//- cache: false,
		//- contentType: false,
		//- processData: false,
		success: function(data) {
			// console.log(data);
			// cb(data);
		},
		error: function() {
			console.log('用户添加角色出错');
		}
	});
	// console.log(user_id);
	// console.log(role_id);
	// console.log('添加角色');
}
jsuser.removeRole = function(user_id, role_id) {
	$.ajax({
		url: '/user/removerole',
		type: 'POST',
		data: {
			user_id: user_id,
			role_id: role_id
		},
		async: false,
		//- cache: false,
		//- contentType: false,
		//- processData: false,
		success: function(data) {
			// console.log(data);
			// cb(data);
		},
		error: function() {
			console.log('用户删除角色出错');
		}
	});
	// console.log(user_id);
	// console.log(role_id);
	// console.log('删除角色');

}