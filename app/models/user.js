// 菜单的models
//引入数据库的框架对象
var mongoose = require('mongoose');
//引入用户的schema对象
var UserSchema = require('../schemas/user');
//生成user的model对象
var User = mongoose.model('User', UserSchema);
//抛出user的module
module.exports = User;