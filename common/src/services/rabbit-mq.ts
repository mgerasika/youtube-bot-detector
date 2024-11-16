import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { IQueryReturn } from '../utils/to-query.util';
import { IRabbitMqBody, IRabbitMqMessage } from '../interfaces/rabbit-mq-message.interface';
import { IDownloadServerRabbitMq } from '@common/interfaces/download-server-rabbit-mq.interface';
import { createLogger, ILogger } from '../utils/create-logger.utils';
import { logMemoryUsage } from '../utils/log-memory.utils';
import { IStatisticServerRabbitMq } from '@common/interfaces/statisic-server-rabbit-mq.interface';
import { IRabbitMqConnectionInfo } from '../model/rabbit-mq-connection-Info.interface';

let _connection: Connection | undefined;
let _channel: Channel;

 async function rabbitMQ_createChannelAsync({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, logger: ILogger) {
    await createConnectionAsync({channelName, rabbit_mq_url}, logger)
     return _channel;
 }
 
  const getInfoAsync = async ({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, logger: ILogger): Promise<IRabbitMqConnectionInfo> => {
     const channel = await rabbitMQ_createChannelAsync({channelName, rabbit_mq_url}, logger);
     try {
       const { messageCount, consumerCount } = await channel.checkQueue(channelName);
       return {messageCount, consumerCount};
     } catch (error) {
       throw new Error(`Error fetching message count: ${error}`);
     }
   };


 async function createConnectionAsync({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, logger: ILogger) {
    if (!_connection || !_channel) {
        try {
            _connection = await amqp.connect(rabbit_mq_url || '');
            if (_connection) {
                logger.log('Connected to Rabbit MQ');
                _channel = await _connection.createChannel();
            }
        } catch (error) {
            logger.log('createConnection rabbitMQ error', error);
            _connection = undefined;
            setTimeout(createConnectionAsync, 30 * 1000);
        }
    }
    if(_connection && _channel) {
        await _channel.assertQueue(channelName, {});

        // important don't remove this 1 - infinite loop
        _channel.prefetch(1);
    }
    return _connection;
}

 async function subscribeAsync({ channelName, rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, callback: (data: IRabbitMqMessage, logger: ILogger) => Promise<any>, logger: ILogger) {
    try {
        const connection = await createConnectionAsync({rabbit_mq_url, channelName: channelName}, logger);
        if (connection) {
            _channel.consume(
                channelName,
                (msg: ConsumeMessage | null) => {
                    const messageLogger = createLogger();
                    if (msg) {
                        const body = Buffer.from(msg.content);
                        // {"msg":{"methodName":"scanCommentsAsync","methodArgumentsJson":{"videoId":"sRdqKztogIQ"}}}
                        messageLogger.log(`rabbit mq data received on '${channelName}':`, `${body}`);
                        let obj: IRabbitMqMessage | undefined;
                        try {
                            obj = JSON.parse(body.toString());
                        } catch (ex) {
                            messageLogger.log('error parse rabbit mq message', ex);
                        }
                        if (obj) {
                            callback(obj, messageLogger)
                                .then(async (res: any[]) => {
                                    messageLogger.log('rabbit mq response', res);
                                   
                                    if (res.length > 1 && res[1]) {
                                        sendAgain( channelName, body, messageLogger);
                                    }
                                    _channel.ack(msg);
                                })
                                .catch(async (ex) => {
                                    logger.log('error in rabbit mq subscribe ', ex);
                                    sendAgain( channelName, body, messageLogger);
                                    _channel.ack(msg);
                                }).finally(() =>{
                                    logMemoryUsage(messageLogger);
                                    messageLogger.log('-----------------------------------')
                                });
                        } else {
                            _channel.ack(msg);
                        }
                    }
                },
                { noAck: false },
            );
        }
    } catch (error) {
        logger.log('known error', error);

        setTimeout(subscribeAsync, 30 * 1000);
    }
}

function sendAgain( channelName: string, body: Buffer, logger: ILogger) {
    logger.log('rabbit mq will send again same message after 1 seccond = ', `${body}`);
   
    setTimeout(() => {
        _channel.sendToQueue(channelName, body, {
            persistent: true, // Ensure the message is durable
        });
    }, 1000);
}


 const sendDataAsync = async <T = any, >({ channelName, rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, methodName: keyof IDownloadServerRabbitMq | keyof IStatisticServerRabbitMq, methodArgumentsJson: T, logger: ILogger): Promise<IQueryReturn<boolean>> => {
    await createConnectionAsync({channelName,  rabbit_mq_url}, logger);

    const data : IRabbitMqMessage = {
        msg: {
            methodName,
            methodArgumentsJson
        }
    }
    if (_channel) {
        logger.log('Rabbit MQ Data send:', data);
        // don't add await - this method should call in paralell
        _channel.sendToQueue(channelName, Buffer.from(JSON.stringify(data)));
      
        return [true];
    } else {
        logger.log('channel is null');
        return [, 'channel is null'];
    }
};

export const rabbitMqService = {
    sendDataAsync,
    subscribeAsync,
    createConnectionAsync,
    getInfoAsync
}
