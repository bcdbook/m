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

//动态获取输入框中的值的方法
iutil.getObj = function() {
	//创建返回值对象
	var data = new Object();
	var eleType; // 定义传入值的类型
	var ele; // 定义传入的参数对象
	var val; // 定义参数值的对象
	var fun; // 定义存值的字符串类型的函数

	//传入参数的描述参数
	var id; //id值(如果传参数,id是必传值)
	var name; //name值,封装到对象中的属性值
	var labelType; //标签类型
	var dataType; //数据类型
	// 循环获取传入的所有参数
	for (var i = 0; i < arguments.length; i++) {
		ele = arguments[i];
		// 获取传入值的类型
		eleType = typeof(ele);
		// 如果是字符串
		if (eleType == 'string') {
			//获取到参数的值
			val = $("#" + ele).val();
			//拼接存储值的函数
			fun = "data." + ele + "=val";
		} else if (eleType == 'object') {
			id = ele.id;
			name = ele.name;
			labelType = ele.labelType;
			dataType = ele.dataType;

			//如果是元素类型是输入框
			if (labelType == 'input' || labelType == '' || labelType == undefined) {
				if (labelType != '' && labelType != undefined && labelType != 'input') {
					val = getValByLabelType(id, labelType);
				} else {
					// 获取参数值
					val = $("#" + id).val();
				}

				//根据传入的参数的数据类型,获取到对应数据类型的数据
				if (dataType != '' && dataType != undefined && dataType != 'string' && dataType != 'String') {
					val = getValByDataType(val, dataType);
				}

				//如果没有传入名字,则使用id为其默认的名字
				if (name == '' || name == undefined) {
					fun = "data." + id + "=val";
				} else {
					//否则使用传入的名字
					fun = "data." + name + "=val";
				}
			}
			//--TODO 这里需要继续丰富
		}
		eval(fun); //执行上方拼接的函数,进行对象的封装
	}
	return data;
}
iutil.cleanInput = function() {
	for (var i = 0; i < arguments.length; i++) {
		$("#" + arguments[i]).val('');
	};
}
iutil.setInput = function() {
	var option; //传入的参数
	var id;
	var val;
	for (var i = 0; i < arguments.length; i++) {
		option = arguments[i];
		id = option.id;
		val = option.val;
		$("#" + id).val(val);
	};
}

//根据传入的元素对象和data的key的集合,返回封装好的对象
//(ele,{dataName:'data-name',objName:'objName'})
iutil.getDatas = function() {
	var ele;
	var dataName;
	var objName;
	var option;
	var data = new Object();
	var fun;
	var val;
	for (var i = 0; i < arguments.length; i++) {
		option = arguments[i];
		if (i == 0) {
			ele = arguments[i];
		} else {
			// fun = "data." + id + "=val";
			dataName = option.dataName;
			objName = option.objName;
			val = ele.data(dataName);
			fun = 'data.' + objName + '=val';
			eval(fun);
		}
	};
	// console.log(data);
	return data;
}