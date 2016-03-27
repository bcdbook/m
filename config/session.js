var cf = require('./config').config;
//session的相关处理开始==============================
//引入session
var session = require('express-session');
//session依赖cookie模块
var cookieParser = require('cookie-parser');
//用来对session进行持久化
//注:这种持久化在服务器进行重启的时候,session不会被清掉
var mongoStore = require('connect-mongo')(session);

// var dbUrl = 'mongodb://localhost/frame';
//session的相关处理结束==============================
//session的具体处理开始========================
module.exports = function(app) {
	// 为app加入cookieParser
	app.use(cookieParser());
	app.use(session({
		secret: 'frame',
		resave: false,
		saveUninitialized: true,
		//使用mongo对session进行持久化，将session存储进数据库中
		store: new mongoStore({
			url: cf.dbUrl, //本地数据库的地址
			collection: 'sessions' //存到数据库时的collection的名字
		})
	}));

	app.use(function(req, res, next) {
		// console.log('********************写入local***************************')
		// console.log(req.session);
		var _user = req.session.user;
		var _menus = req.session.menus;
		// console.log('app.use.session')
		// console.log(_user);
		if (_user) {
			app.locals.user = _user;
			// console.log('app.locals.user' + app.locals.user);
		} else {
			delete app.locals.user;
			// res.render('index')
			// res.redirect('/')
		}
		if (_menus) {
			app.locals.menus = _menus;
			// console.log('app.locals.user' + app.locals.user);
		} else {
			delete app.locals.menus;
			// res.render('index')
			// res.redirect('/')
		}
		// console.log('app.user.locals');
		// console.log(app.locals.user);
		next();
	});
}

//session的具体处理结束========================