require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, {polling: true});
const start_command = '/startpricebot',
stop_command = '/stoppricebot';
var chatId = null, intervalTimer = null;

function getPriceJson(){
    let json = JSON.parse(fs.readFileSync(path.resolve('../','discord-bot','latest-price.json')).toString());
    return json;
}



bot.on('message', (msg) => {
    if(chatId == null){
        chatId = msg.chat.id;
    }
    if(msg.text.toString().toLowerCase().includes(start_command) && intervalTimer == null){
        bot.sendMessage(chatId, `Price Watching: Enabled`);
        console.log(`Price Watching: Enabled`)
        watchTiddiesPrice();
    }
    else if(msg.text.toString().toLowerCase().includes(stop_command) && intervalTimer != null){
        bot.sendMessage(chatId, `Price Watching: Disabled`);
        console.log(`Price Watching: Disabled`)
        clearInterval(intervalTimer)
    }
});

function watchTiddiesPrice(){
    intervalTimer = setInterval(() => {
        let price_json = getPriceJson();
        if(typeof price_json.latest_price != 'undefined'){
            bot.sendMessage(chatId, `Current Price: $${price_json.latest_price} ${price_json.price_movement}`);
        }
    }, 300000);
}