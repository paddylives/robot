
const TelegramBot = require('node-telegram-bot-api');
// const Agent = require('socks5-https-client/lib/Agent');
const token = '1489365929:AAHl6rCZmXgZgfhukKelaf0uYlrfoxcMToo';
var bot = new TelegramBot(token, {
    polling: true,
    // request: {
    //     agentClass: Agent,
    //     agentOptions: {
    //         socksHost: '127.0.0.1',
    //         socksPort: 10808
    //     }
    // }
});

module.exports = bot;