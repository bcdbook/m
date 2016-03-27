var wechat = require('wechat');

var config = {
  token: 'bcdbookweixin',
  appid: 'wxd19632a7323cec33',
  encodingAESKey: '2Uc6oEJuyTmvBGzHNNQWcB61Y1JLAShas56qEaziySE'
};

// 微信下方栏目的开发开始==============
var appid = 'wxd19632a7323cec33';
var appsecret = 'c414992afedfe0155c857f907cebd8da';
var menus = {
  "button": [{
    "name": "菜单",
    "sub_button": [{
      "type": "view",
      "name": "资讯菜单",
      "url": "http://ip:port/all"
    }]
  }, {
    "name": "菜单2",
    "sub_button": [{
      "type": "view",
      "name": "我的11",
      "url": "http://ip:port/all"
    }]
  }, {
    "name": "助理",
    "sub_button": [{
      "type": "view",
      "name": "大学",
      "url": "http://ip:port/all"
    }, {
      "type": "view",
      "name": "社区",
      "url": "http://ip:port/all"
    }]
  }]
}

var API = require('wechat-api');
var api = new API(appid, appsecret);

// 微信下方栏目的开发配置开始==============
module.exports = function() {

  api.createMenu(menus, function(err, result) {
    console.log(result);
  });
}

// 微信下方栏目的开发配置结束==============
// 微信下方栏目的开发配置结束==============

// app.use(express.query());
module.exports = function(app) {
  app.use('/wechat', wechat(config, function(req, res, next) {

    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    console.log(message);
    if (message.Content === 'diaosi') {
      // 回复屌丝(普通回复)
      res.reply('hehe');
    } else if (message.Content === 'text') {
      //你也可以这样回复text类型的信息
      res.reply({
        content: 'text object',
        type: 'text'
      });
    } else if (message.Content === 'hehe') {
      // 回复一段音乐
      res.reply({
        type: "music",
        content: {
          title: "来段音乐吧",
          description: "一无所有",
          musicUrl: "http://mp3.com/xx.mp3",
          hqMusicUrl: "http://mp3.com/xx.mp3",
          thumbMediaId: "thisThumbMediaId"
        }
      });
    } else {
      // 回复高富帅(图文回复)
      res.reply([{
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }]);
    }
  }));
}



// module.exports = app;