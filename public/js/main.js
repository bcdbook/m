function getWechatBarcode() {
	return '<div class="wechat_2d_barcode"></div>'
}

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
	$(document).on('click', '.menu .menu_item a', function() {
		$('.menu .menu_item').each(function(index, ele) {
			//- console.log(ele);
			$(ele).removeClass('item_checked');
			//- removeClass()
		});
		$(this).parent('.menu_item').addClass('item_checked');
	})
})