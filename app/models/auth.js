// 菜单的models
//引入数据库的框架对象
var mongoose = require('mongoose');
//引入用户的schema对象
var AuthSchema = require('../schemas/auth');
//生成Auth的model对象
var Auth = mongoose.model('Auth', AuthSchema);
//抛出Auth的module
module.exports = Auth;