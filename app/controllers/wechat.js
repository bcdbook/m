var openid = 'ohCXWslf0xWVK4jumLYNMen8Sv6o';

//引入本地的配置文件
var config = require('../../config/config').config;
var w = config.wechat;
//引入wechat-oauth框架
var OAuth = require('wechat-oauth');
var api = new OAuth(w.appid, w.appsecret);


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
	var url = api.getAuthorizeURL(redirectUrl, state, scope);
	// var url = api.getAuthorizeURL(redirectUrl, scope);
	res.redirect(url);
}

exports.user = function(req, res) {
	var code = req.query.code;
	console.log('code=========================')
	console.log(code)
	var data;
	api.getAccessToken(code, function(err, result) {
		data = result.data;
		console.log('data=========================');
	});
	console.log(data);
	//获取用户的基本信息时,此方法需要放到getAccessToken里边,
	//否则token失效,则不能拿到想要的结果
	api.getUser(data.openid, function(err, result) {
		console.log('result=========================');
		console.log(result);
	})
	res.render('index', {
		title: "首页"
	});
}