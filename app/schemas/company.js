// 公司的schema

//引入mongoose框架
var mongoose = require('mongoose');
// 调用,并定义schema
var Schema = mongoose.Schema;
//这个用法,我一直不是太明白
var ObjectId = Schema.Types.ObjectId;

//像是java中定义全参构造的意思
var CompanySchema = new Schema({
	name: String, //公司名字
	order: Number,
	//菜单的时间相关数据
	company_remark: {
		type: Boolean,
		default: false
	},
	meta: {
		//菜单的添加时间
		createAt: {
			type: Date,
			default: Date.now()
		},
		//菜单的修改时间
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
	// ,
	// departments: [{
	// 	name: String, //部门名称
	// 	order: Number
	// }]
})

// var ObjectId = mongoose.Schema.Types.ObjectId
//在保存方法之情之前执行
CompanySchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	next()
})

CompanySchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({
				_id: id
			})
			.exec(cb)
	}
}

module.exports = CompanySchema;