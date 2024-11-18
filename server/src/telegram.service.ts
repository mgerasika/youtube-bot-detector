import { ILogger } from '@common/utils/create-logger.utils';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import axios from 'axios';
import { toQuery } from '@common/utils/to-query.util';

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you got from BotFather
const token: string = '8053691546:AAHj_80Zt98CEB6AI_ImLBMHO4LBeTdixYo';


const subscribe = (logger: ILogger) => {
    logger.log('Start telegram bot')
    const bot = new TelegramBot(token, { polling: true });
    bot.on('message', async (msg: Message) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    logger.log(`Received message from ${chatId}: ${messageText}`);
    if(messageText && messageText?.includes('@gmail.com') && messageText?.includes('\n')) {
        const parts = messageText.trim().split('\n')
        logger.log('recieved parts', parts)
        if(parts.length === 2) {
            const [email, key] = parts;

            const [post] = await toQuery(() => axios.post('http://192.168.0.5:8099/api/scan/add-youtube-key', {email,key}));
            if(post) {
                return bot.sendMessage(chatId, '' + post.data?.message);
            }
            else {
                return bot.sendMessage(chatId, 'error ');
            }
        }
    }

    // Optionally, you can reply to the message
    bot.sendMessage(chatId, 'Message received!');
    });
}

export const telegramBot = { subscribe}
