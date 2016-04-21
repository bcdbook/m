var nodemailer = require("nodemailer");
var config = require('../../config/config').config;
var m = config.mail;

var mongoose = require('mongoose');
var User = mongoose.model('User');
// var mail_token = "zmd8ecSaU4ISesJU3r3gRu8u8zAzCkMtujvbEzDKPB0hk0Bj7Cy";
exports.toMail = function(req, res) {
	res.render('mail/mail', {

	})
}
exports.canResend = function(req, res) {
	var userid = req.query.id;
	User
		.findOne({
			_id: userid
		}, function(err, user) {
			if (err) {
				res.json({
					code: 500,
					data: 0,
					msg: '重新发送信息出错'
				});
			} else {
				//当上次的发送时间到现在不足2分钟
				if ((Date.now() - user.verifyAt) < 120000) {

					res.json({
						code: 200,
						data: 0,
						msg: '两次发送间隔太短'
					});
				} else {
					res.json({
						code: 200,
						data: 1,
						msg: '可以重新发送了'
					});
				}
				// console.log(Date.now() - user.verifyAt);
			}
		})
}
exports.isExist = function(req, res) {
	var usermail = req.query.usermail;
	User
		.findOne({
			email: usermail
		}, function(err, user) {
			if (err) {
				res.json({
					code: 500,
					data: 1,
					msg: '检测用户出错了'
				})
			}
			if (user) {
				res.json({
					code: 200,
					data: 1,
					msg: '邮箱已经被占用'
				})
			} else {
				res.json({
					code: 200,
					data: 0,
					msg: '此邮箱未被占用'
				})
			}
		})
}

//执行邮件的发送操作
exports.sendMail = function(req, res) {
	var transporter = nodemailer.createTransport("SMTP", {
		host: m.host,
		secureConnection: m.useSSL, // use SSL
		port: m.port, // port for secure SMTP
		auth: {
			user: m.user,
			pass: m.pwd
		}
	});
	var data = req.body.data;
	// console.log(data);
	var mailOptions = {
		from: m.from, // sender address 
		to: data.usermail,
		subject: data.subject, // Subject line 
		text: data.text, // plaintext body 
		html: data.p
	};
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			return console.log(error);
		}
		transporter.close();
	});

	res.json({
		code: 200,
		data: 1,
		msg: '邮件发送成功'
	});
}

//用于获取要发送的邮箱,和要发送的对象,及相应参数
exports.getmail = function(req, res) {
	// console.log(req.query)
	var mailtype = req.query.mailtype;
	// console.log(req.query.mailtype);
	//如果是验证邮箱
	if (mailtype == 1) {
		var username = req.query.username;
		var userid = req.query.userid;
		var usermail = req.query.usermail;
		var uuid = req.query.uuid;
		// console.log(uuid);

		//设置邮件发送的时间,避免多次重复发送
		User.where({
			_id: userid
		}).update({
			verifyAt: Date.now(),
			verifyToken: uuid,
			meilVerify: 1
		}).exec();

		res.render('mail/usetoverify', {
			username: username,
			userid: userid,
			usermail: usermail,
			mail_token: uuid,
			url: m.verify_url,
			subject: '[Bcdbook]邮箱验证', // Subject line
			text: '本邮件用于Bcdbook网站的邮箱验证' // plaintext body
				// html: req.body.data
		});
	} else {
		res.json({
			code: 500,
			data: 0,
			msg: '邮件拼接出错了'
		});
	}
}


exports.toverify = function(req, res) {
	var user_id = req.params.user_id;
	// console.log(user_id);
	// console.log(req.query)
	// console.log(req.primary)
	User.findOne({
		_id: user_id
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		res.render('mail/verify', {
			user: user
		});
	})
}

//执行邮箱验证操作
exports.verify = function(req, res) {
	var id = req.query.userid;
	var usermail = req.query.usermail;
	var mail_token = req.query.mail_token;

	User.findOne({
		_id: id
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			// console.log(user);
			//验证通过,如果token相同
			if (user.verifyToken == mail_token) {
				//执行绑定
				User.where({
					_id: id
				}).update({
					email: usermail,
					verifyToken: 0,
					meilVerify: 2
				}).exec();

				res.render('user/signin', {
					user: user
				});
			} else {
				res.json({
					code: 500,
					data: 0,
					msg: '此链接可能已使用过'
				})
			}
		} else {
			res.json({
				code: 500,
				data: 0,
				msg: '未找到对应的用户'
			})
		}
	})
}