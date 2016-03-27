var cf = require('./config').config;
var w = cf.wechat;
var wechat = require('wechat');
var IWechat = require('../app/controllers/wechat');

var config = {
	token: w.token,
	appid: w.appid,
	encodingAESKey: w.encodingAESKey
};

var API = require('wechat-api');
var api = new API(w.appid, w.appsecret);

module.exports = function(app) {
	//创建栏目
	api.createMenu(w.menus, function(err, result) {
		// console.log('执行创建栏目的方法')
		console.log(result);
	});
	//监听用户发来的消息
	app.use('/wechat', wechat(config, IWechat.wechat));
}