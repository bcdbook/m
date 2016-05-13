// 引入mongoose框架
var mongoose = require('mongoose');
//创建Schemas对象
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//引入加密插件的对象
var bcrypt = require('bcrypt');
//设置加密的强度,数值越大越难破解,同时需要的时间也更多
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
	username: String, //用户名
	pwd: String, //密码
	realname: {
		type: String, //真实姓名
		default: '姓名'
	},
	photo: {
		type: String, //用户的头像
		default: '../img/user.png'
	},
	position: { //职位
		type: Number,
		default: 10
	},
	email: String, //邮箱
	phone: String, //手机号码
	company: String, //公司
	depart: String, //部门的id
	depart_remark: {
		type: String, //部门的备份文件名
		default: '部门'
	},
	openid: String, //微信绑定后的唯一认证信息
	roles: [{ //角色列表
		type: ObjectId,
		ref: 'Role'
	}],
	meta: {
		createAt: { //创建时间
			type: Date,
			default: Date.now()
		},
		updateAt: { //更新时间
			type: Date,
			default: Date.now()
		}
		//发送认证邮件的时间
	},
	meilVerify: { //邮箱认证状态
		type: Number,
		default: 0 //默认是0,表示未认证.1表示已经发送邮件2表示已认证通过
	},
	verifyToken: String, //验证时的对比凭证
	verifyAt: {
		type: Date, //最后一次发送验证信息的时间
		default: Date.now() - 120000
	}

});
module.exports = UserSchema;

// 在保存方法执行前调用此方法
UserSchema.pre('save', function(next) {
	// 把this赋给当前对象
	var user = this;
	// 如果是新创建的对象
	if (this.isNew) {
		// 把创建时间和修改时间均设置成当前系统时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		// 如果创建不是新创建的对象,就把更新时间设置成当前系统时间
		this.meta.updateAt = Date.now();
	}

	//处理加密相关的信息
	// 生成盐
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		// 如果出错,则直接返回
		if (err) return next(err);

		//调用加密方法,进行加密,同时传入上个方法中生成的盐
		bcrypt.hash(user.pwd, salt, function(err, hash) {
			if (err) return next(err);

			//把生成的密码赋给当前的用户的密码
			user.pwd = hash;
			next();
		})
	});
});

// 定义抛出的工具(用于检测密码是否正确)方法
UserSchema.methods = {
	//定义方法名字并实现方法
	comparePwd: function(pwd, cb) {
		//调用加密方法进行对比,传入需要对比的密码和当前密码
		bcrypt.compare(pwd, this.pwd, function(err, isMatch) {
			if (err) return cb(err);

			cb(null, isMatch);
		});
	}
}

// 定义常规的查询方法
UserSchema.statics = {
	//查询所有的数据,并以更新时间排序
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	//根据特定的id进行查询
	findById: function(id, cb) {
		return this
			.findOne({
				_id: id
			})
			.exec(cb)
	}
}