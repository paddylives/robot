var bot = require('../bot/bot');
const phantom=require('phantom');
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
    const chatId = msg.chat.id
    const linkUrl = match[1].toString();
    phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
            page.open(linkUrl).then(function(status) {
                page.property('viewportSize', { width: 1920, height: 1080 });
                var name = '/publish/'+formatTime()+'.jpg';
                page.render('.'+name).then(function() {
                    bot.sendMessage(chatId, "https://telegram.solosolo.tk/base"+name);
                    ph.exit();
                }).catch(()=>{
                    bot.sendMessage(chatId, "保存图片异常");
                });
            }).catch(()=>{
                bot.sendMessage(chatId, "无法访问该连接");
            });
        });
    });
}
