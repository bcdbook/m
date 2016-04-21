// {
// 	code: 200, 	表示正确,没有出现异常
// 	code: 200, 	表示错误,服务器出现异常
// 	data: 1,	表示值存在,或验证通过
// isexist: 1	表示存在
// isexist: 0	表示不存在
// 	msg: '邮件发送成功'	对应的提示信息
// mailtype:1	表示用于验证的邮件
// }
exports.config = {
	// "dbUrl": "mongodb://root:Java1234@42.96.195.183:27017/frame",
	"dbUrl": "mongodb://localhost/frame",
	"mail": {
		"host": "smtp.163.com",
		"useSSL": true,
		"port": 465,
		"user": "bcdbook@163.com",
		"pwd": "li95287048",
		"from": "Bcdbook<bcdbook@163.com>",
		"token": "zmd8ecSaU4ISesJU3r3gRu8u8zAzCkMtujvbEzDKPB0hk0Bj7Cy",
		"verify_url": "http://www.bcdbook.com/mail/verify"
	},
	"wechat": {
		// "token": "bcdbookweixin",
		"token": "solar",
		// appid: "wxd19632a7323cec33",
		// "appid": "wx0ce1dd815fbb3afd",
		"appid": "wx18d7b3cb67983626",
		// var appsecret = "c414992afedfe0155c857f907cebd8da";
		// "appsecret": "83ddcb3aa8438cb87003cc444f7f6a8a",
		"appsecret": "bd8194a6707b334583b363a8318b59f0",
		// "encodingAESKey": "2Uc6oEJuyTmvBGzHNNQWcB61Y1JLAShas56qEaziySE",
		"encodingAESKey": "1BIqibAgB4GnC1izNv0wEab0YrErwiv3uaaRCmElBBV",
		"menus": {
			"button": [{
				"type": "click",
				"name": "单个点击",
				"key": "click_key"

			}, {
				"name": "菜单",
				"sub_button": [{
					"type": "view",
					"name": "跳转认证",
					"url": "http://www.bcdbook.com/wechat/attest"
				}, {
					"type": "scancode_waitmsg",
					"name": "扫码带提示",
					"key": "scancode_waitmsg_key",
					"sub_button": []
				}, {
					"type": "scancode_push",
					"name": "扫码推事件",
					"key": "scancode_push_key",
					"sub_button": []
				}, {
					"name": "发送位置",
					"type": "location_select",
					"key": "location_select_key"
				}]
			}, {
				"name": "发图",
				"sub_button": [{
					"type": "pic_sysphoto",
					"name": "系统拍照发图",
					"key": "rselfmenu_1_0",
					"sub_button": []
				}, {
					"type": "pic_photo_or_album",
					"name": "拍照或者相册发图",
					"key": "rselfmenu_1_1",
					"sub_button": []
				}, {
					"type": "pic_weixin",
					"name": "微信相册发图",
					"key": "rselfmenu_1_2",
					"sub_button": []
				}]
			}]
		}
	}
}