var bot = require('../bot/bot');
const phantom=require('phantom');
var fs = require('fs');
var request = require('request');
// 格式化时间
function formatTime() {
    var date = new Date(),
      Y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate(),
      H = date.getHours(),
      i = date.getMinutes();
    if (m < 10) {
      m = "0" + m;
    }
    if (d < 10) {
      d = "0" + d;
    }
    if (H < 10) {
      H = "0" + H;
    }
    if (i < 10) {
      i = "0" + i;
    }
    var t = Y + m + d + "-" + H + i;
    return t;
}


var options = {
  'method': 'POST',
  'url': 'https://sm.ms/api/v2/upload',
  'headers': {
    'Authorization': '5zLoPZa19XKWxfAYH5VmARIrpOKONS0C',
    'Cookie': 'PHPSESSID=qhaoevt8ma64h28mnduhkol9s0',
    'User-Agent': 'PostmanRuntime/7.26.8'
  },
  formData: {
    'smfile': {
      'value': "",
      'options': {
        'filename': "",
        'contentType': null
      }
    }
  }
};



module.exports = (msg) => {
    console.log("进入进入");
    const chatId = msg.chat.id
    console.log(msg)
    const linkUrl = msg.text;
    console.log(linkUrl)
    bot.sendMessage(chatId, "收到指令，开始访问URL");
    phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
            page.open(linkUrl).then(function(status) {
              page.property('viewportSize', { width: 1920, height: 1080 });
              if(status === "fail"){
                bot.sendMessage(chatId, "无法访问该连接，请核实："+linkUrl);
                ph.exit();
              }else{
                bot.sendMessage(chatId, "访问成功，十秒后开始转图片");
                setTimeout(() => {
                  var name = '/publish/'+formatTime()+'.jpg';
                  page.render('.'+name).then(function() {
                    options.formData.smfile.value = fs.createReadStream('.'+name)
                    options.formData.smfile.options.filename = '.'+name;
                    request(options, function (error, response) {
                      if (error){
                        bot.sendMessage(chatId, "转换图片失败，上传异常");
                        return ph.exit();
                      };
                      if(response.body){
                        var result = JSON.parse(response.body);
                        bot.sendMessage(chatId, "转换图片成功：");
                        bot.sendMessage(chatId, result.images||result.data.url);
                      };
                      ph.exit();
                    });
                  }).catch((e)=>{
                    console.log(e)
                      bot.sendMessage(chatId, "保存图片异常");
                      ph.exit();
                  });
                }, 10000);
              }
              
            });
        });
    });
}
