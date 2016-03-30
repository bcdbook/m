// 菜单的models
//引入数据库的框架对象
var mongoose = require('mongoose');
//引入用户的schema对象
var MenuSchema = require('../schemas/menu');
//生成Menu的model对象
var Menu = mongoose.model('Menu', MenuSchema);
//抛出Menu的module
module.exports = Menu;