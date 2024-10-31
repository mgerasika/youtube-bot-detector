import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { IQueryReturn } from './to-query.util';
import { IRabbitMqBody, IRabbitMqMessage } from '../interfaces/rabbit-mq-message.interface';
import { connectToRedisAsync , redis_setAsync, TRedisClient} from './redis';
import { IScan } from '@common/interfaces/scan.interface';
import { ILogger } from './create-logger.utils';

let _connection: Connection | undefined;
let _channel: Channel;

export async function rabbitMQ_createChannelAsync({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, logger: ILogger) {
    await rabbitMQ_createConnectionAsync({channelName, rabbit_mq_url}, logger)
     return _channel;
 }
 
 export interface IConnectionInfo {
     messageCount: number;
     consumerCount: number;
 }
 export const rabbit_mq_getConnectionInfoAsync = async ({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, logger: ILogger): Promise<IConnectionInfo> => {
     const channel = await rabbitMQ_createChannelAsync({channelName, rabbit_mq_url}, logger);
     try {
       const { messageCount, consumerCount } = await channel.checkQueue(channelName);
       return {messageCount, consumerCount};
     } catch (error) {
       throw new Error(`Error fetching message count: ${error}`);
     }
   };
   
export async function rabbitMQ_createConnectionAsync({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, logger: ILogger) {
    if (!_connection || !_channel) {
        try {
            _connection = await amqp.connect(rabbit_mq_url || '');
            if (_connection) {
                logger.log('Connected to Rabbit MQ');
                _channel = await _connection.createChannel();

                await _channel.assertQueue(channelName, {});

                // important don't remove this 1 - infinite loop
                _channel.prefetch(1);
            }
        } catch (error) {
            logger.log('createConnection rabbitMQ error', error);
            _connection = undefined;
            setTimeout(rabbitMQ_createConnectionAsync, 30 * 1000);
        }
    }
    return _connection;
}

export async function rabbitMQ_subscribeAsync({ channelName, rabbit_mq_url, redis_url}:{channelName:string, rabbit_mq_url: string, redis_url: string}, callback: (data: IRabbitMqMessage) => Promise<any>, logger: ILogger) {
    try {
        const redisClient = await connectToRedisAsync(redis_url, logger);
        const connection = await rabbitMQ_createConnectionAsync({rabbit_mq_url, channelName: channelName}, logger);
        if (connection) {
            _channel.consume(
                channelName,
                (msg: ConsumeMessage | null) => {
                    if (msg) {
                        const body = Buffer.from(msg.content);
                        // {"msg":{"methodName":"scanCommentsAsync","methodArgumentsJson":{"videoId":"sRdqKztogIQ"}}}
                        logger.log('rabbit mq data received on download server:', `${body}`);
                        let obj: IRabbitMqMessage | undefined;
                        try {
                            obj = JSON.parse(body.toString());
                        } catch (ex) {
                            logger.log('error parse rabbit mq message', ex);
                        }
                        if (obj) {
                            const messageId = getRabbitMqMessageId(obj.msg.methodName as keyof IScan, obj.msg.methodArgumentsJson);
                            callback(obj)
                                .then(async (res: any[]) => {
                                    logger.log('rabbit mq response', res);
                                   
                                    if (res.length > 1 && res[1]) {
                                        logger.log('remove from redis', messageId);
                                        await redisClient.del(messageId);

                                        sendAgain( channelName, body, logger);
                                    }
                                    _channel.ack(msg);
                                })
                                .catch(async () => {
                                    logger.log('remove from redis ', messageId);
                                    await redisClient.del(messageId);

                                    sendAgain( channelName, body, logger);
                                    _channel.ack(msg);
                                }).finally(() =>{
                                    logger.log('-----------------------------------')
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

        setTimeout(rabbitMQ_subscribeAsync, 30 * 1000);
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

export const getRedisMessageId = (category : 'channel' | 'video' | 'comment', id: string) => {
    return `${category}/${id}`;
}

export const getRabbitMqMessageId = <T = any,>(methodName: keyof IScan, methodArgumentsJson: T) => {
    const json: IRabbitMqBody = {
        methodName: methodName,
        methodArgumentsJson: methodArgumentsJson,
    }
    return `rabbit-mq-${JSON.stringify(json)}`;
}
export const rabbitMQ_sendDataAsync = async <T = any, >({ channelName, rabbit_mq_url, redis_url}:{channelName:string, rabbit_mq_url: string, redis_url:string}, methodName: keyof IScan, methodArgumentsJson: T, logger: ILogger): Promise<IQueryReturn<boolean>> => {
    await rabbitMQ_createConnectionAsync({channelName,  rabbit_mq_url}, logger);
    const redisClient = await connectToRedisAsync(redis_url, logger);

    const data : IRabbitMqMessage = {
        msg: {
            methodName,
            methodArgumentsJson
        }
    }
    if (_channel) {
        const messageId = getRabbitMqMessageId(methodName, methodArgumentsJson);
        const exist = await redisClient.exists(messageId);
        if (!exist) {
            logger.log('Rabbit MQ Data send:', data);
            await _channel.sendToQueue(channelName, Buffer.from(JSON.stringify(data)));
        } else {
            logger.log('Rabbit MQ - already exist in Redis, skip', messageId);
        }
        return [true];
    } else {
        logger.log('channel is null');
        return [, 'channel is null'];
    }
};
