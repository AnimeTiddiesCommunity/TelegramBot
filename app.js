require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const contractText = fs.readFileSync(path.join(__dirname, 'contract.txt')).toString();
const chartText = fs.readFileSync(path.join(__dirname, 'chart.txt')).toString();
const bot = new TelegramBot(process.env.TOKEN, {polling: true});
const start_command = '/startpricebot',
stop_command = '/stoppricebot',
price_command = '/price',
price_check_interval = 1000 * 60 * 30;
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
        clearInterval(intervalTimer);
        intervalTimer = null;
    }
    else if(msg.text.toString().toLowerCase().includes(price_command)){
        let price_message = getPriceMessage();
        if(price_message.length > 0){
            bot.sendMessage(chatId, price_message);
        }
        else{
            bot.sendMessage(chatId, "Price not currently available.");
        }
    }
    else if(msg.text.toString().toLowerCase().indexOf("contract") != -1){
        bot.sendMessage(chatId, contractText);
    }
    else if(msg.text.toString().toLowerCase().indexOf("chart") != -1){
        bot.sendMessage(chatId, chartText);
    }
});

function getPriceMessage(){
    let price_json = getPriceJson(), price_message = '';
    if(typeof price_json.latest_price != 'undefined'){
        price_message = `${price_json.price_movement} Current Price: $${price_json.latest_price.toFixed(10)}`
    }
    return price_message;
}

function watchTiddiesPrice(){
    intervalTimer = setInterval(() => {
        let price_message = getPriceMessage();
        if(price_message.length > 0){
            bot.sendMessage(chatId, price_message);
        }
    }, price_check_interval);
}