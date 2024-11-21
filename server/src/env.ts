export const ENV = {
    db_master: process.env.DB_MASTER,
    db_slave: process.env.DB_SLAVE,
    db_owner_user: process.env.DB_OWNER_USER,
    db_owner_password: process.env.DB_OWNER_PASSWORD,
    node_env: process.env.NODE_ENV,
    rabbit_mq_url: process.env.RABBIT_MQ || '',
    rabbit_mq_download_channel_name: 'youtube-bot-filter-queue-v4',
    rabbit_mq_statistic_channel_name: 'youtube-bot-statistic-v4',
};

export const RABBIT_MQ_DOWNLOAD_ENV = {
    channelName: ENV.rabbit_mq_download_channel_name,
    rabbit_mq_url: ENV.rabbit_mq_url,
};

export const RABBIT_MQ_STATISTIC_ENV = {
    channelName: ENV.rabbit_mq_statistic_channel_name,
    rabbit_mq_url: ENV.rabbit_mq_url,
};
