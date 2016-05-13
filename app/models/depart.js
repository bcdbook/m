// 菜单的models
//引入数据库的框架对象
var mongoose = require('mongoose');
//引入用户的schema对象
var DepartSchema = require('../schemas/depart');
//生成Depart的model对象
var Depart = mongoose.model('Depart', DepartSchema);
//抛出Depart的module
module.exports = Depart;