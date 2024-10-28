import { createClient } from 'redis';
import { ILogger } from './create-logger.utils';

// docker run -d --name redis-container --restart always -p 6379:6379 redis
// docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest


export type TRedisClient = ReturnType<typeof createClient>;

let _client: TRedisClient | undefined;
export async function connectToRedisAsync(redis_url: string, logger: ILogger): Promise<TRedisClient > {
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
                connectToRedisAsync(redis_url, logger)
            }, 30*1000);
        }
        return _client;
    }
    return _client;
}

export const redis_setAsync = async (redisClient: TRedisClient, messageId: string) => {
    const oneDay = 24*60*60;
    const oneYear = 12*30*oneDay;
    await redisClient.set(messageId, '', {
        EX: oneYear
    });
}