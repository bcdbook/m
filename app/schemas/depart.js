// 公司的schema

//引入mongoose框架
var mongoose = require('mongoose');
// 调用,并定义schema
var Schema = mongoose.Schema;
//这个用法,我一直不是太明白
var ObjectId = Schema.Types.ObjectId;

//像是java中定义全参构造的意思
var DepartSchema = new Schema({
	name: String, //部门名字
	order: Number,
	company: String,
	depart_remark: {
		type: Boolean,
		default: false
	},
	//菜单的时间相关数据
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
DepartSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	next()
})

DepartSchema.statics = {
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

module.exports = DepartSchema;