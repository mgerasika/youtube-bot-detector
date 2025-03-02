export const ENV = {
    node_env: process.env.NODE_ENV,
    rabbit_mq_url: process.env.RABBIT_MQ || '',
    one_by_one_timeout: 0,
    api_server_url: process.env.API_SERVER_URL,
    redis_url: process.env.REDIS_URL || '',
    rabbit_mq_channel_name: 'youtube-bot-filter-queue-v2'
};

export const RABBIT_MQ_ENV = {
    channelName: ENV.rabbit_mq_channel_name,
    rabbit_mq_url: ENV.rabbit_mq_url,
    redis_url: ENV.redis_url
}