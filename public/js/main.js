//获取微信二维码的代码块
function getWechatBarcode() {
	return '<div class="wechat_2d_barcode"></div>'
}

//获取用户简介的代码块
function getUserIntd() {
	var img_url = '../img/user.png';
	return '<div class="user_intd_box">' +
		'<div class="intd_top">' +
		'<div style="background-image: url(' + img_url + ');" class="intd_photo"></div>' +
		'<div class="intd_info">' +
		'<p class="intd_info_msg">产品技术部</p>' +
		'<p class="intd_info_msg">李显</p>' +
		'<p class="intd_info_msg">xianforwork@163.com</p>' +
		'</div>' +
		'<div class="intd_top_icon"><a class="inner_icon_tiny icon_msg"><i class="iconfont hover_default">&#xe608;</i></a></div>' +
		'</div>' +
		'<div class="intd_body"></div>' +
		'<div class="intd_foot"><a class="intd_foot_msg hover_default">发起申请</a><a class="intd_foot_icon"><i class="iconfont hover_default">&#xe601;</i>'
	'+</a></div>' +
	'</div>'
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
		// var val = $(this).val();
		// console.log(val);
		// if (val == '' || val == undefined || val == NaN) {
		// 	$(this).next('.l_label').css("top", "-27px");
		// } else {
		// }
	})
})