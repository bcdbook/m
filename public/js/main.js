//获取微信二维码的代码块
function getWechatBarcode() {
	return '<div class="wechat_2d_barcode"></div>'
}

//获取用户简介的代码块
function getUserIntd() {
	// (data-para-_id='#{onlineUser._id}',data-para-username='#{onlineUser.username}',data-para-realname='#{onlineUser.realname}',data-para-photo='#{onlineUser.photo}',data-para-position='#{onlineUser.position}',data-para-email='#{onlineUser.email}',data-para-phone='#{onlineUser.phone}')
	var user_datas = $('#user_info_msg_hide_datas');

	var _id = user_datas.data('para-_id');
	var username = user_datas.data('para-username');
	var realname = user_datas.data('para-realname');
	var photo = user_datas.data('para-photo');
	var position = user_datas.data('para-position');
	var email = user_datas.data('para-email');
	var phone = user_datas.data('para-phone');

	return '<div class="user_intd_box">' +
		'<div class="intd_top">' +
		'<div style="background-image: url(' + photo + ');" class="intd_photo"></div>' +
		'<div class="intd_info">' +
		'<p class="intd_info_msg">产品技术部</p>' +
		'<p class="intd_info_msg">李显</p>' +
		'<p class="intd_info_msg">xianforwork@163.com</p>' +
		'</div>' +
		'<div class="intd_top_icon"><a class="inner_icon_tiny icon_msg"><i class="iconfont hover_default icon-class-shezhi"></i></a></div>' +
		'</div>' +
		'<div class="intd_body"></div>' +
		'<div class="intd_foot"><a class="intd_foot_msg hover_default">发起申请</a><a class="intd_foot_icon"><i class="iconfont hover_default icon-class-exit"></i>'
	'+</a></div>' +
	'</div>'

	// return '<div class="user_intd_box">' +
	// 	'<div class="intd_top">' +
	// 	'<div style="background-image: url(' + photo + ');" class="intd_photo"></div>' +
	// 	'<div class="intd_info">' +
	// 	'<p class="intd_info_msg">产品技术部</p>' +
	// 	'<p class="intd_info_msg">' + realname + '</p>' +
	// 	'<p class="intd_info_msg">' + email + '</p>' +
	// 	'</div>' +
	// 	'<div class="intd_top_icon"><a class="inner_icon_tiny icon_msg"><i class="iconfont hover_default">&#xe608;</i></a></div>' +
	// 	'</div>' +
	// 	'<div class="intd_body"></div>' +
	// 	'<div class="intd_foot"><a class="intd_foot_msg hover_default">发起申请</a><a class="intd_foot_icon"><i class="iconfont hover_default">&#xe601;</i>'
	// '+</a></div>' +
	// '</div>';
}

$(function() {
	//栏目的点击效果的切换,被选中的栏目需要有底色
	$(document).on('click', '.menu .menu_item a', function() {
		// console.log($(this).parents(".menu_box").first());
		// console.log($(this).parents(".menu_box").first().find('.menu .menu_item'));
		$(this).parents(".menu_box").first().find('.menu .menu_item').each(function(index, ele) {
			//- console.log(ele);
			$(ele).removeClass('item_checked');
			//- removeClass()
		});
		$(this).parent('.menu_item').addClass('item_checked');
	});
	//角色的点击效果的切换,被选中的角色需要有底色
	$(document).on('click', '.menu .menu_item a', function() {
		// console.log($(this).parents(".menu_box").first());
		// console.log($(this).parents(".menu_box").first().find('.menu .menu_item'));
		$(this).parents(".role_box").first().find('.menu .menu_item').each(function(index, ele) {
			//- console.log(ele);
			$(ele).removeClass('item_checked');
			//- removeClass()
		});
		$(this).parent('.menu_item').addClass('item_checked');
	});

	// 根据输入框中是否有值,来动态设定数据库中属性提示的样式
	$(document).on('blur', '.l_input_div .l_input', function() {
		var val = $(this).val();
		// console.log(val);
		if (val == '' || val == undefined || val == NaN) {
			$(this).next('.l_label').css("top", "-27px");
		} else {
			$(this).next('.l_label').css("top", "-48px");
		}
	})
	$(document).on('focus', '.l_input_div .l_input', function() {
		$(this).next('.l_label').css("top", "-48px");
	});

	$(document).on('click', '.item_change_menu', function() {
		var url = $(this).data("item-url");
		// var 
		$.ajax({
			url: url,
			type: 'GET',
			data: {},
			async: false,
			//- cache: false,
			//- contentType: false,
			//- processData: false,
			success: function(data) {
				cb(data);
			},
			error: function() {
				console.log('pathExcel error2')
			}
		});

		function cb(data) {
			$("#main").html(data);
		}
	});

});