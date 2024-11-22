import { ILogger } from '@common/utils/create-logger.utils';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import axios from 'axios';
import { toQuery } from '@common/utils/to-query.util';
import { allServerInfo } from './controller/all-server-info/all-server-info.service';
import { allServices } from './controller/all-services';

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you got from BotFather
const token: string = '8053691546:AAHj_80Zt98CEB6AI_ImLBMHO4LBeTdixYo';


const subscribe = (logger: ILogger) => {
    logger.log('Start telegram bot')
    const bot = new TelegramBot(token, { polling: true });
    bot.on('message', async (msg: Message) => {
      
        const ip = await getDownloadServerIp(logger);
        const chatId = msg.chat.id;
        const messageText = msg.text;

        logger.log(`Received message from ${chatId}: ${messageText}`);
        if(!ip) {
            return  bot.sendMessage(chatId, 'download server ip not found ');
        }
        if(messageText && messageText?.includes('@gmail.com') && messageText?.includes('\n')) {
            const parts = messageText.trim().split('\n')
            logger.log('recieved parts', parts)
            if(parts.length === 2) {
                const [email, key] = parts;


                const [post] = await toQuery(() => axios.post(`http://${ip}/api/scan/add-youtube-key`, {email,key}));
                if(post) {
                    return bot.sendMessage(chatId, '' + post.data?.message);
                }
                else {
                    return bot.sendMessage(chatId, 'post error to download server');
                }
            }
        }

        // Optionally, you can reply to the message
        bot.sendMessage(chatId, 'Message received!');
    });
}

async function getDownloadServerIp(logger: ILogger): Promise<string | undefined> {
    const [serversInfo, error] = await allServices.allServerInfo.getServerInfoListAsync(logger);
    if(error || !serversInfo) {
        return undefined;
    }
    return serversInfo.find(s => s.name === 'download-server')?.ip
}

export const telegramBot = { subscribe}
