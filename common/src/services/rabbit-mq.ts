import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { IQueryReturn } from '../utils/to-query.util';
import { IRabbitMqBody, IRabbitMqMessage } from '../interfaces/rabbit-mq-message.interface';
import { IDownloadServerRabbitMq } from '@common/interfaces/download-server-rabbit-mq.interface';
import { createLogger, ILogger } from '../utils/create-logger.utils';
import { logMemoryUsage } from '../utils/log-memory.utils';
import { IStatisticServerRabbitMq } from '@common/interfaces/statisic-server-rabbit-mq.interface';
import { IRabbitMqConnectionInfo } from '../model/rabbit-mq-connection-Info.interface';

const _connections: Record<string, Connection | undefined> = {};
const _channels: Record<string, Channel | undefined> = {};

async function getChannelAsync({ channelName, rabbit_mq_url }: { channelName: string, rabbit_mq_url: string }, logger: ILogger): Promise<Channel | undefined> {
    await createConnectionAsync({ channelName, rabbit_mq_url }, logger)
    return _channels[channelName];
}

const getInfoAsync = async ({ channelName, rabbit_mq_url }: { channelName: string, rabbit_mq_url: string }, logger: ILogger): Promise<IRabbitMqConnectionInfo> => {
    const channel = await getChannelAsync({ channelName, rabbit_mq_url }, logger);
    try {
        if (!channel) {
            throw 'channel is null';
        }
        const { messageCount, consumerCount } = await channel.checkQueue(channelName);
        return { messageCount, consumerCount };
    } catch (error) {
        throw new Error(`Error fetching message count: ${error}`);
    }
};


async function createConnectionAsync({ channelName, rabbit_mq_url }: { channelName: string, rabbit_mq_url: string }, logger: ILogger): Promise<Connection | undefined> {
    if (!_connections[channelName] || !_channels[channelName]) {
        try {
            const conn = _connections[channelName] = await amqp.connect(rabbit_mq_url || '');
            if (conn) {
                logger.log('Connected to Rabbit MQ', channelName);
                _channels[channelName] = await conn.createChannel();
            }
        } catch (error) {
            logger.log('createConnection rabbitMQ error', error);
            _connections[channelName] = undefined;
            setTimeout(() => createConnectionAsync({ channelName, rabbit_mq_url }, logger), 30 * 1000);
        }
    }
    const connection = _connections[channelName];
    const channel = _channels[channelName];
    if (connection && channel) {
        await channel.assertQueue(channelName, { durable: true });

        // important don't remove this 1 - infinite loop
        channel.prefetch(1);
    }
    return connection;
}

async function subscribeAsync({ channelName, rabbit_mq_url }: { channelName: string, rabbit_mq_url: string }, callback: (data: IRabbitMqMessage, logger: ILogger) => Promise<any>, logger: ILogger) {

    const connection = await createConnectionAsync({ rabbit_mq_url, channelName: channelName }, logger);
    const channel = await getChannelAsync({ channelName, rabbit_mq_url }, logger);
    if (connection && channel) {

        try {
            channel.consume(
                channelName,
                (msg: ConsumeMessage | null) => {
                    const messageLogger = createLogger();
                    if (msg) {
                        const body = Buffer.from(msg.content);
                        // {"msg":{"methodName":"scanCommentsAsync","methodArgumentsJson":{"videoId":"sRdqKztogIQ"}}}
                        messageLogger.log('-----------------------------------')
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
                                        sendAgainWithDelay(channelName, body, messageLogger, () => {
                                            channel.ack(msg);
                                        });
                                    }
                                    else {
                                        channel.ack(msg);
                                    }
                                })
                                .catch(async (ex) => {
                                    logger.log('error in rabbit mq subscribe ', ex);
                                    sendAgainWithDelay(channelName, body, messageLogger, () => {
                                        channel.ack(msg);
                                    });

                                }).finally(() => {
                                    logMemoryUsage(messageLogger);

                                });
                        } else {
                            logger.log('error parse JSON in rabbit mq subscribe ');
                            sendAgainWithDelay(channelName, body, messageLogger, () => {
                                channel.ack(msg);
                            });
                        }
                    }
                },
                { noAck: false },
            );
        } catch (error) {
            logger.log('known error', error);

            setTimeout(() => subscribeAsync({ channelName, rabbit_mq_url }, callback, logger), 30 * 1000);
        }
    }
}

function sendAgainWithDelay(channelName: string, body: Buffer, logger: ILogger, callback: () => void) {
    logger.log('rabbit mq will send again same message after 1 seccond = ', `${body}`);

    setTimeout(() => {
        const channel = _channels[channelName];
        if (channel) {
            channel.sendToQueue(channelName, body, {
                persistent: true, // Ensure the message is durable
            });

            callback();
        }
    }, 1000);
}


const sendDataAsync = async <T = any,>({ channelName, rabbit_mq_url }: { channelName: string, rabbit_mq_url: string }, methodName: keyof IDownloadServerRabbitMq | keyof IStatisticServerRabbitMq, methodArgumentsJson: T, logger: ILogger): Promise<IQueryReturn<boolean>> => {
    await createConnectionAsync({ channelName, rabbit_mq_url }, logger);

    const data: IRabbitMqMessage = {
        msg: {
            methodName,
            methodArgumentsJson
        }
    }

    const channel = _channels[channelName];
    if (channel) {
        logger.log('Rabbit MQ Data send:', data);
        // don't add await - this method should call in paralell
        channel.sendToQueue(channelName, Buffer.from(JSON.stringify(data)), { persistent: true });

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
