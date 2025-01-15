import { createClient } from 'redis';
import { ILogger } from '../utils/create-logger.utils';

// docker run -d --name redis-container --restart always -p 6379:6379 redis
// docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest

export type TRedisClient = ReturnType<typeof createClient>;

let _client: TRedisClient | undefined;
async function connectAsync(redis_url: string, logger: ILogger): Promise<TRedisClient > {
    if (!_client) {
        // Create a Redis client
        _client = createClient({
            url: redis_url, // Use the appropriate connection string
        });
        try {
            await _client.connect();
            // Handle errors
            _client.on('error', (err) => {
                logger.log('Error connecting to Redis:', err);
            });
        } catch (err) {
            logger.log('Error connecting to Redis:', err);

            setTimeout(() => {
                connectAsync(redis_url, logger)
            }, 30*1000);
        }
        return _client;
    }
    return _client;
}

const oneDay = 24*60*60;
const oneYear = 12*30*oneDay;
const setAsync = async ( messageId: string, exp?: number ) => {
    await _client?.set(messageId, '', {
        EX: exp || oneYear * 10
    });
}

const delAsync = async ( messageId: string) => {
    await _client?.del(messageId);
}

const getMessageId = (category : 'channel' | 'video' | 'comment' | 'statistic' | 'full-video', id: string) => {
    return `${category}/${id}`;
}

export const redisService = {
    connectAsync,
    setAsync,
    getMessageId,
    delAsync,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    existsAsync : (...params:any) => _client?.exists(...params),
};