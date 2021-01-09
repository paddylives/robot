
const TelegramBot = require('node-telegram-bot-api');
const token = '';
var bot = new TelegramBot(token, {
    polling: true,
});

module.exports = bot;