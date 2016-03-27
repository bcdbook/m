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
				"name": "菜单",
				"sub_button": [{
					"type": "view",
					"name": "资讯菜单",
					"url": "http://ip:port/all"
				}]
			}, {
				"name": "菜单2",
				"sub_button": [{
					"type": "view",
					"name": "我的11",
					"url": "http://ip:port/all"
				}]
			}, {
				"name": "助理",
				"sub_button": [{
					"type": "view",
					"name": "大学",
					"url": "http://ip:port/all"
				}, {
					"type": "view",
					"name": "社区",
					"url": "http://ip:port/all"
				}]
			}]
		}
	}
}