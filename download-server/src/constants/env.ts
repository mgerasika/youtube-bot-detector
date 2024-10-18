export const ENV = {
    node_env: process.env.NODE_ENV,
    rabbit_mq: process.env.RABBIT_MQ,
    one_by_one_timeout: 0,
    send_to_rabbit_mq_again_delay: 1000,
    api_server_url: process.env.API_SERVER_URL,
    redis_url: process.env.REDIS_URL
};
