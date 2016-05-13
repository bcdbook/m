// 菜单的models
//引入数据库的框架对象
var mongoose = require('mongoose');
//引入用户的schema对象
var CompanySchema = require('../schemas/company');
//生成Company的model对象
var Company = mongoose.model('Company', CompanySchema);
//抛出Company的module
module.exports = Company;