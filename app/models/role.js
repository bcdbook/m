// 菜单的models
//引入数据库的框架对象
var mongoose = require('mongoose');
//引入用户的schema对象
var RoleSchema = require('../schemas/role');
//生成Role的model对象
var Role = mongoose.model('Role', RoleSchema);
//抛出Role的module
module.exports = Role;