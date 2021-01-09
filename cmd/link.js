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
    const linkUrl = match[1].toString();
    bot.sendMessage(chatId, "收到指令，即将执行，预计10s左右");
    phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
            page.open(linkUrl).then(function(status) {
                page.property('viewportSize', { width: 1920, height: 1080 });
                console.log("status"+status)
                console.log("保存图片"+status);
                var base64 = page.renderBase64("PNG");
                bot.sendMessage(chatId, base64);
                bot.sendMessage(chatId, "指令完成！");
                ph.exit();
            }).catch(()=>{
                bot.sendMessage(chatId, "无法访问该连接");
            });
        });
    });
}
