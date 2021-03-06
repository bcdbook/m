var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Role = require('../app/controllers/role');
var File = require('../app/controllers/file');
var PathExcel = require('../app/controllers/pathexcel');
var Mail = require('../app/controllers/mail');
var Markdown = require('../app/controllers/markdown');
var Wechat = require('../app/controllers/wechat');
var Menu = require('../app/controllers/menu');
var Auth = require('../app/controllers/auth');
var Company = require('../app/controllers/company');
var Depart = require('../app/controllers/depart');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// user controller
module.exports = function(app) {
	app.get('/i', Index.i); //进入登录页面
	app.get('/', User.signinRequired, Index.index);

	//user route
	app.get('/signin', User.tosignin); //进入登录页面
	app.post('/signin', User.signin); //执行登录操作
	app.get('/signup', User.tosignup); //进入注册页面
	app.post('/signup', User.signup); //执行注册操作
	app.get('/logout', User.logout); //执行注册操作
	app.post('/user/isexist', User.isExist); //检查用户名是否存在

	app.get('/user/list', User.list);
	app.get('/user/edit:id', User.edit);
	app.post('/user/roles', User.roles); //获取用户所拥有的角色
	app.post('/user/addrole', User.addRole); //用户添加角色的方法
	app.post('/user/removerole', User.removeRole); //用户删除角色的方法
	app.get('/user/infoonline', User.infoOnline); //已登录的用户,点击栏目,编辑自己信息的方法
	app.get('/user/info:id', User.info); //获取用户的详细信息
	app.post('/user/update', User.update); //获取用户的详细信息

	//menu route
	app.post('/menu/add', Menu.add); //添加栏目的方法
	app.post('/menu/update', Menu.update); //更新栏目的方法
	app.get('/menu/list', Menu.list); //查询栏目列表
	app.post('/menu/haschild', Menu.hasChild); //检查此栏目下边有没有子集
	app.post('/menu/remove', Menu.remove); //删除栏目的方法
	app.post('/menu/order', Menu.order); //排序栏目的方法

	//power route
	app.post('/auth/add', Auth.add); //添加权限的方法
	app.post('/auth/update', Auth.update); //添加权限的方法
	app.get('/auth/list:menuid', Auth.list); //列表展示权限的方法
	app.post('/auth/list', Auth.auths); //列表展示权限的方法
	app.post('/auth/remove', Auth.remove); //删除权限的方法
	app.post('/auth/order', Auth.order); //执行重新排序

	//role route
	app.get('/role/toadd', Role.toAdd);
	app.get('/role/list', Role.list); //列表展示角色
	app.post('/role/add', Role.add); //添加角色
	app.post('/role/update', Role.update); //修改角色
	app.post('/role/remove', Role.remove); //删除角色
	app.get('/role/showauths:_id', Role.showAuths); //展示角色所拥有的权限
	app.post('/role/removeauth', Role.removeAuth); //展示角色所拥有的权限
	app.post('/role/addauth', Role.addAuth); //展示角色所拥有的权限
	app.post('/role/removemenu', Role.removeMenu); //展示角色所拥有的栏目
	app.post('/role/addmenu', Role.addMenu); //展示角色所拥有的栏目
	// app.post('/role/roles', Role.roles); //展示所拥有的栏目

	//file upload
	app.get('/toupload', File.toupload);
	app.post('/upload', File.upload);
	app.post('/ajaxupload', multipartMiddleware, File.ajaxupload);

	//excel file todo
	app.get('/topath', PathExcel.topath);
	app.post('/pathexcel', PathExcel.pathexcel);
	app.post('/exportexcel', PathExcel.exportExcel);

	//mail something todo
	app.get('/mail/toverify:user_id', Mail.toverify); //进入发送邮件页面(测试使用)
	app.get('/mail/verify', Mail.verify); //真实的执行验证操作
	app.get('/tomail', Mail.toMail);
	app.post('/mail/sendmail', Mail.sendMail); //用于发送邮件
	app.get('/mail/getmail', Mail.getmail); //用于发送邮件
	app.get('/mail/canresend', Mail.canResend); //获取是否可重复发送邮件
	app.get('/mail/isexist', Mail.isExist); //获取是否可重复发送邮件

	//company someting TODO
	app.get('/company/list', Company.list); //列表展示公司
	app.post('/company/add', Company.add); //添加公司接口
	app.post('/company/update', Company.update); //更新公司接口
	app.post('/company/remove', Company.remove); //删除公司的

	//departsometing todo
	app.get('/depart/list:company_id', Depart.list); //部门列表展示
	app.post('/depart/add', Depart.add); //添加部门
	app.post('/depart/update', Depart.update); //更新部门
	app.post('/depart/remove', Depart.remove); //删除部门
	app.post('/depart/departs', Depart.departs); //获取部门的相关数据

	//markdown something todo
	app.get('/tomarkdown', Markdown.toMarkdown);
	app.post('/markdown', Markdown.markdown);

	//微信的相关认证
	app.get('/wechat/attest', Wechat.attest);
	app.get('/wechat/user', Wechat.user);
	app.get('/wechat/tosend', Wechat.toSend);
	app.post('/wechat/sendtext', Wechat.sendText);
	app.post('/wechat/sendtemplate', Wechat.sendTemplate);

	//其他未找到的页面跳转地址
	app.get('*', User.tosignin);
}