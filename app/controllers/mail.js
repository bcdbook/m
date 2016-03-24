var nodemailer = require("nodemailer");

exports.toMail = function(req, res) {
	res.render('mail/mail', {

	})
}

exports.sendMail = function(req, res) {
	var transporter = nodemailer.createTransport("SMTP", {
		host: "smtp.qq.com",
		secureConnection: true, // use SSL
		port: 465, // port for secure SMTP
		auth: {
			user: "952870487@qq.com",
			pass: "Forcoder!2#"
		}
	});

	// setup e-mail data with unicode symbols 
	var mailOptions = {
		from: '显示的名字<952870487@qq.com>', // sender address 
		// to: 'lixian13149999@163.com', // list of receivers 
		to: '835910706@qq.com',
		subject: '邮件主题', // Subject line 
		text: '简要介绍文本', // plaintext body 
		html: '<b>html格式的文本主体内容</b><img src="http://pic6.nipic.com/20100323/4214896_084058018310_2.jpg"/>' // html body 
	};

	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			return console.log(error);
		}
		transporter.close();
	});

	res.json({
		code: 200,
		msg: {
			data: 'success'
		}
	});
}