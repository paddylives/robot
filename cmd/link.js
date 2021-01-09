var bot = require('../bot/bot');
const phantom=require('phantom');
var fs = require('fs');
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
module.exports = (msg, match) => {
    console.log("进入进入");
    const chatId = msg.chat.id
    console.log(msg)
    const linkUrl = msg.text;
    console.log(linkUrl)
    bot.sendMessage(chatId, "收到指令，即将执行，预计10s左右");
    phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
            page.open(linkUrl).then(function(status) {
              console.log("状态："+status);
              page.property('viewportSize', { width: 1920, height: 1080 });
              setTimeout(() => {
                if(status === "fail"){
                  bot.sendMessage(chatId, "无法访问该连接，请核实："+linkUrl);
                  ph.exit();
                }else{
                  console.log("开始转图片")
                  var name = '/publish/'+formatTime()+'.jpg';
                  page.render('.'+name).then(function() {
                      bot.sendMessage(chatId, "https://telegram.solosolo.tk/base"+name);
                      ph.exit();
                  }).catch((e)=>{
                    console.log(e)
                      bot.sendMessage(chatId, "保存图片异常");
                      ph.exit();
                  });
                }
              }, 10000);
            });
        });
    });
}
