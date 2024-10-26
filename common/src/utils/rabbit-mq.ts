import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { IQueryReturn } from './to-query.util';
import { IRabbitMqBody, IRabbitMqMessage } from '../interfaces/rabbit-mq-message.interface';
import { connectToRedisAsync } from './redis';
import { IScan } from '@common/interfaces/scan.interface';

let _connection: Connection | undefined;
let _channel: Channel;

export async function rabbitMQ_createChannelAsync({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}) {
    await rabbitMQ_createConnectionAsync({channelName, rabbit_mq_url})
     return _channel;
 }
 
 export interface IConnectionInfo {
     messageCount: number;
     consumerCount: number;
 }
 export const rabbit_mq_getConnectionInfoAsync = async ({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}): Promise<IConnectionInfo> => {
     const channel = await rabbitMQ_createChannelAsync({channelName, rabbit_mq_url});
     try {
       const { messageCount, consumerCount } = await channel.checkQueue(channelName);
       return {messageCount, consumerCount};
     } catch (error) {
       throw new Error(`Error fetching message count: ${error}`);
     }
   };
   
export async function rabbitMQ_createConnectionAsync({channelName,  rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}) {
    if (!_connection || !_channel) {
        try {
            _connection = await amqp.connect(rabbit_mq_url || '');
            if (_connection) {
                console.log('Connected to Rabbit MQ');
                _channel = await _connection.createChannel();

                await _channel.assertQueue(channelName, {});

                _channel.prefetch(1);
            }
        } catch (error) {
            console.log('createConnection rabbitMQ error', error);
            _connection = undefined;
            setTimeout(rabbitMQ_createConnectionAsync, 30 * 1000);
        }
    }
    return _connection;
}

export async function rabbitMQ_subscribeAsync({ channelName, rabbit_mq_url}:{channelName:string, rabbit_mq_url: string}, callback: (data: IRabbitMqMessage) => Promise<any>) {
    try {
        const connection = await rabbitMQ_createConnectionAsync({rabbit_mq_url, channelName: channelName});
        if (connection) {
            _channel.consume(
                channelName,
                (msg: ConsumeMessage | null) => {
                    if (msg) {
                        const body = Buffer.from(msg.content);
                        console.log('Rabbit MQ Data received on download server:', `${body}`);
                        let obj;
                        try {
                            obj = JSON.parse(body.toString());
                        } catch (ex) {
                            console.log('error parse rabbit mq message', ex);
                        }
                        if (obj) {
                            callback(obj)
                                .then((res: any[]) => {
                                    console.log('Rabbit MQ response = ', res);
                                    if (res.length > 1 && res[1]) {
                                        sendAgain(channelName, body);
                                    }
                                    _channel.ack(msg);
                                })
                                .catch(() => {
                                    sendAgain(channelName, body);
                                    _channel.ack(msg);
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
        console.log('known error', error);

        setTimeout(rabbitMQ_subscribeAsync, 30 * 1000);
    }
}

function sendAgain(channelName: string, body: Buffer) {
    console.log('Rabbit MQ send again = ', `${body}`);
    setTimeout(() => {
        _channel.sendToQueue(channelName, body, {
            persistent: true, // Ensure the message is durable
        });
    }, 1000);
}

export const getRabbitMqMessageId = <T = any,>(methodName: keyof IScan, methodArgumentsJson: T) => {
    const json: IRabbitMqBody = {
        methodName: methodName,
        methodArgumentsJson: methodArgumentsJson,
    }
    return `rabbitMQ:-${JSON.stringify(json)}`;
}
export const rabbitMQ_sendDataAsync = async <T = any, >({ channelName, rabbit_mq_url, redis_url}:{channelName:string, rabbit_mq_url: string, redis_url:string}, methodName: keyof IScan, methodArgumentsJson: T): Promise<IQueryReturn<boolean>> => {
    await rabbitMQ_createConnectionAsync({channelName,  rabbit_mq_url});
    const redisClient = await connectToRedisAsync(redis_url);

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
            const oneWeek = 7*24*3600;
            await redisClient.set(messageId, '', {
                EX: 12*30*oneWeek,//one year
            });

            console.log('Rabbit MQ Data send and add to Redis:', data);
            await _channel.sendToQueue(channelName, Buffer.from(JSON.stringify(data)));
        } else {
            console.log('Rabbit MQ - already exist in Redis, skip');
        }
        return [true];
    } else {
        console.log('channel is null');
        return [, 'channel is null'];
    }
};
