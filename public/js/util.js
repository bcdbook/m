var iutil = new Object();
$(function() {
	$('[data-toggle="popover"]').each(function() {
		var ele = $(this); //获取定义了弹出框的对象
		var id = ele.attr('id'); //获取id
		var txt = ele.html(); //获取其中的html标签
		ele.popover({
			trigger: 'manual', //触发方式
			placement: 'bottom', //top, bottom, left or right,显示在当前按钮的什么位置
			title: getMethodTitle(id), //标题
			html: 'true', //为true的话，data-content里就能放html代码了
			content: contentMethod(id), //这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
			// }).on("click", function() { //鼠标穿过事件
		}).on("mouseenter", function() { //鼠标穿过事件
			var _this = this;
			$(this).popover("show"); //显示当前的提示
			//当遍历弹出框有穿出事件时,隐藏当前的弹出框
			$(this).siblings(".popover").on("mouseleave", function() {
				$(_this).popover('hide');
			});
			//当鼠标穿出当前按钮时
			// }).on("click", function() {
		}).on("mouseleave", function() {
			var _this = this;
			//设定一个延时器,防止滑动的时候,触发到边界值
			setTimeout(function() {
				// console.log($(".popover:hover"));
				if (!$(".popover:hover").length) {
					$(_this).popover("hide")
				}
			}, 100);
		});
	});
});

function contentMethod(id) {
	if (id == "wechat_2d_barcode") {
		return getWechatBarcode();
	} else if (id == 'user_introduction') {
		return getUserIntd();
	} else {
		return 'text';
	}
}

function getMethodTitle(id) {

	return '';
}

iutil.uuid = function() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";
	var uuid = s.join("");
	return uuid;
}