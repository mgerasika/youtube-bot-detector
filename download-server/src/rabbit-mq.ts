import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { IQueryReturn } from './utils/to-query.util';
import { ENV } from './constants/env';
import { CONST } from './constants/const.contant';
import { IRabbitMqMessage } from './interfaces/rabbit-mq-message.interface';
import { IAsyncPromiseResult } from './interfaces/async-promise-result.interface';

let _connection: Connection | undefined;
let _channel: Channel;

export async function rabbitMQ_createConnectionAsync() {
    if (!_connection || !_channel) {
        try {
            _connection = await amqp.connect(ENV.rabbit_mq || '');
            if (_connection) {
                console.log('Connected to Rabbit MQ');
                _channel = await _connection.createChannel();

                await _channel.assertQueue(CONST.RABBIT_MQ_CHANNEL_NAME, {});

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

export async function rabbitMQ_subscribeAsync(callback: (data: IRabbitMqMessage) => Promise<any>) {
    try {
        const connection = await rabbitMQ_createConnectionAsync();
        if (connection) {
            _channel.consume(
                CONST.RABBIT_MQ_CHANNEL_NAME,
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
                                        sendAgain(body);
                                    }
                                    _channel.ack(msg);
                                })
                                .catch(() => {
                                    sendAgain(body);
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

function sendAgain(body: Buffer) {
    console.log('Rabbit MQ send again = ', `${body}`);
                                        setTimeout(() => {
                                            _channel.sendToQueue(CONST.RABBIT_MQ_CHANNEL_NAME, body, {
                                                persistent: true, // Ensure the message is durable
                                            });
                                        }, ENV.SEND_TO_RABBIT_MQ_AGAIN_DELAY);
}

export const rabbitMQ_sendDataAsync = async (data: IRabbitMqMessage): Promise<IQueryReturn<boolean>> => {
    await rabbitMQ_createConnectionAsync();

    if (_channel) {
        console.log('Rabbit MQ Data send :', data);
        await _channel.sendToQueue(CONST.RABBIT_MQ_CHANNEL_NAME, Buffer.from(JSON.stringify(data)));
        return [true];
    } else {
        console.log('channel is null');
        return [, 'channel is null'];
    }
};
