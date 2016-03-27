// exports.DB_URL = "mongodb://localhost/frame';
exports.config = {
	"dbUrl": "mongodb://localhost/frame",
	"wechat": {
		"token": "bcdbookweixin",
		// appid: "wxd19632a7323cec33",
		"appid": "wx0ce1dd815fbb3afd",
		// var appsecret = "c414992afedfe0155c857f907cebd8da";
		"appsecret": "83ddcb3aa8438cb87003cc444f7f6a8a",
		"encodingAESKey": "2Uc6oEJuyTmvBGzHNNQWcB61Y1JLAShas56qEaziySE",
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
					"url": "http://www.bcdbook.com/w/attest"
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