require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, {polling: true});
const command = '/startpricebot';
var chatId = null;

function getPriceJson(){
    let json = JSON.parse(fs.readFileSync(path.resolve('../','discord-bot','latest-price.json')).toString());
    return json;
}



bot.on('message', (msg) => {
    if(chatId == null){
        if(msg.text.toString().toLowerCase().includes(command)){
            console.log("Price Bot Enabled")
            chatId = msg.chat.id;
            setInterval(() => {
                let price_json = getPriceJson();
                if(typeof price_json.latest_price != 'undefined'){
                    bot.sendMessage(chatId, `Current Price: $${price_json.latest_price} ${price_json.price_movement}`);
                }
            }, 5000);
        }
    }
});