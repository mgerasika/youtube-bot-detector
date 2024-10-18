import { createClient } from 'redis';

// docker run -d --name redis-container --restart always -p 6379:6379 redis
// docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest


export type TRedisClient = ReturnType<typeof createClient>;

let _client: TRedisClient | undefined;
export async function connectToRedisAsync(): Promise<TRedisClient > {
    if (!_client) {
        // Create a Redis client
        _client = createClient({
            url: 'redis://192.168.0.16:6379', // Use the appropriate connection string
        });
        try {
            await _client.connect();
            // Handle errors
            _client.on('error', (err) => {
                console.error('Error connecting to Redis:', err);
            });
        } catch (err) {
            console.error('Error connecting to Redis:', err);
            throw err;
        }
        return _client;
    }
    return _client;
}
