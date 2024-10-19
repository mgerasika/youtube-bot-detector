import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { ENV } from './constants/env';
import { IRabbitMqMessage } from './interfaces/rabbit-mq-message.interface';
import { CONST } from './constants/const.contant';
import { IAsyncPromiseResult } from './interfaces/async-promise-result.interface';

let _connection: Connection | undefined;
let _channel: Channel;

export async function rabbitMQ_createConnectionAsync() {
    if (!_connection || !_channel ) {
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

export async function rabbitMQ_createChannelAsync() {
   await rabbitMQ_createConnectionAsync()
    return _channel;
}

export const rabbit_mq_getMessageCountAsync = async (): Promise<number> => {
    const channel = await rabbitMQ_createChannelAsync();
    try {
      const { messageCount } = await channel.checkQueue(CONST.RABBIT_MQ_CHANNEL_NAME);
      return messageCount; // Return the count of messages in the queue
    } catch (error) {
      throw new Error(`Error fetching message count: ${error}`);
    }
  };

export async function rabbitMQ_subscribeAsync(callback: (data: IRabbitMqMessage) => Promise<any>) {
    try {
        const connection = await rabbitMQ_createConnectionAsync();
        if (connection) {
            _channel.consume(
                CONST.RABBIT_MQ_CHANNEL_NAME,
                (data: ConsumeMessage | null) => {
                    if (data) {
                        const body = Buffer.from(data.content);
                        console.log('Rabbit MQ Data received on server :', `${body}`);
                        let obj;
                        try {
                            obj = JSON.parse(body.toString());
                        } catch (ex) {
                            console.log('error parse rabbit mq message', ex);
                        }
                        if (obj) {
                            callback(obj)
                                .then((res) => {
                                    console.log('rabbit mq response = ', res);
                                    _channel.ack(data);
                                })
                                .catch(() => {
                                    _channel.ack(data);
                                });
                        } else {
                            _channel.ack(data);
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

export const rabbitMQ_sendDataAsync = async (data: IRabbitMqMessage): IAsyncPromiseResult<boolean> => {
    await rabbitMQ_createConnectionAsync();

    if (_channel) {
        await _channel.sendToQueue(CONST.RABBIT_MQ_CHANNEL_NAME, Buffer.from(JSON.stringify(data)));
        return [true];
    } else {
        console.log('channel is null');
        return [, 'channel is null'];
    }
};
