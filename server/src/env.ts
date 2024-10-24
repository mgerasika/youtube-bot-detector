export const ENV = {
    user: process.env.DB_USER,
    owner_user: process.env.DB_OWNER_USER,
    owner_password: process.env.DB_OWNER_PASSWORD,
    db_host: process.env.DB_HOST, //'178.210.131.101',
    database: 'youtube-bot-filter',
    password: process.env.DB_PASSWORD,
    node_env: process.env.NODE_ENV,
    port: 5432,
    rabbit_mq_url: process.env.RABBIT_MQ || '',
    redis_url: process.env.REDIS_URL || '',
    rabbit_mq_channel_name: 'youtube-bot-filter-queue-v2'
};
