// var openid = 'ohCXWslf0xWVK4jumLYNMen8Sv6o';

//引入本地的配置文件
var config = require('../../config/config').config;
var w = config.wechat;
//引入wechat-oauth框架
var OAuth = require('wechat-oauth');
var ioauth = new OAuth(w.appid, w.appsecret);

var API = require('wechat-api');
var api = new API(w.appid, w.appsecret);


exports.wechat = function(req, res, next) {
	// 微信输入信息都在req.weixin上
	var message = req.weixin;
	console.log(message);
	if (message.Content === 'diaosi') {
		// 回复屌丝(普通回复)
		res.reply('hehe');
	} else if (message.Content === 'text') {
		//你也可以这样回复text类型的信息
		res.reply({
			content: 'text object',
			type: 'text'
		});
	} else if (message.Content === 'hehe') {
		// 回复一段音乐
		res.reply({
			type: "music",
			content: {
				title: "来段音乐吧",
				description: "一无所有",
				musicUrl: "http://mp3.com/xx.mp3",
				hqMusicUrl: "http://mp3.com/xx.mp3",
				thumbMediaId: "thisThumbMediaId"
			}
		});
	} else {
		// 回复高富帅(图文回复)
		res.reply([{
			title: '你来我家接我吧',
			description: '这是女神与高富帅之间的对话',
			picurl: 'https://img3.doubanio.com/view/note/large/public/p31819340.jpg',
			url: 'http://www.bcdbook.com/wechat/attest'
		}]);
	}
}
exports.attest = function(req, res) {
	console.log('进入授权页面');
	//设定重定向的链接地址
	var redirectUrl = 'http://www.bcdbook.com/wechat/user';
	//设定传到后台的参数(自定义的)
	var state = 'toattest';
	// 设定获取的信息的详细程度
	// var scope = 'snsapi_base'; //只获取用户的openid(不弹出授权界面)
	//这里出现过无数次的无权限提示,原因是需要设定网页账号.设定后才能通过scope权限
	var scope = 'snsapi_userinfo'; //获取用户的所有信息(弹出授权页面)
	// var scope = 'snsapi_base';
	var url = ioauth.getAuthorizeURL(redirectUrl, state, scope);
	console.log('url');
	console.log(url);
	// var url = ioauth.getAuthorizeURL(redirectUrl, scope);
	res.redirect(url);
}

exports.user = function(req, res) {
	var code = req.query.code;
	console.log('code=========================')
	console.log(code);
	// var data;
	ioauth.getAccessToken(code, function(err, result) {
		var data = result.data;
		console.log('data=========================');
		console.log(data);
		//获取用户的基本信息时,此方法需要放到getAccessToken里边,
		//否则token失效,则不能拿到想要的结果
		ioauth.getUser(data.openid, function(err, result) {
			console.log('result=========================');
			console.log(result);
		})
	});
	res.render('index', {
		title: "首页"
	});
}

exports.toSend = function(req, res) {
	res.render('wechat/tosend');
}

exports.sendText = function(req, res) {
	var data = req.body.wechat;
	console.log(data);
	var openid = data.openid;
	var msg = data.msg;
	var access_token = data.access_token;
	var refresh_token = data.refresh_token;
	// var msg = "这是后台推送的消息";
	api.sendText(openid, msg, function(req, res) {
		console.log('调用消息推送页面成功');
	});
	res.json({
		code: 200,
		msg: {
			// url: 'http://' + req.headers.host
			url: 'newPath'
		}
	});
}

exports.setIndustry = function(req, res) {

	var industryIds = {
		"industry_id1": "1",
		"industry_id2": "4"
	}

	//设置行业类型
	api.setIndustry(industryIds, function(err, result) {
		console.log('设置行业生效')
		console.log(err)
		console.log(result)

	});
	res.json({
		code: 200,
		msg: {
			// url: 'http://' + req.headers.host
			url: 'newPath'
		}
	});
}
exports.addTemplate = function(req, res) {
	var templateIdShort = 'TM00015';
	//添加模板
	api.addTemplate(templateIdShort, function(err, result) {
		console.log('设置模板生效');
		console.log(err);
		console.log(result);

	});
	res.json({
		code: 200,
		msg: {
			// url: 'http://' + req.headers.host
			url: 'newPath'
		}
	});
}
exports.sendTemplate = function(req, res) {
	// -BfKkoAQGC9Inb_4RAVkKkXq5N5mL-CfaxEZovaecXY
	var data = req.body.wechat;
	console.log(data);
	var openid = data.openid;
	var msg = data.msg;
	var access_token = data.access_token;
	var refresh_token = data.refresh_token;

	// var templateId: 'TM00015';
	var templateId = '-BfKkoAQGC9Inb_4RAVkKkXq5N5mL-CfaxEZovaecXY';
	// var templateId = 'QmwPkXNuihaO454-gCKVAeuTRkO84x2CW3yHruExkoA';
	// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
	var url = 'https://www.baidu.com';
	var data = {
		"first": {
			"value": "恭喜你购买成功！",
			"color": "#173177"
		},
		"orderProductName": {
			"value": "巧克力",
			"color": "#173177"
		},
		"orderMoneySum": {
			"value": "39.8元",
			"color": "#173177"
		},
		"Remark": {
			"value": "欢迎再次购买！",
			"color": "#173177"
		}
	};
	api.sendTemplate(openid, templateId, url, data, function(req, res) {
		console.log('执行消息发送')
	});

	//设置行业

	res.json({
		code: 200,
		msg: {
			// url: 'http://' + req.headers.host
			url: 'newPath'
		}
	});
}