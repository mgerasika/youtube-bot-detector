export const ENV = {
    user: process.env.DB_USER,
    owner_user: process.env.DB_OWNER_USER,
    owner_password: process.env.DB_OWNER_PASSWORD,
    db_host: process.env.DB_HOST, //'178.210.131.101',
    database: 'youtube-bot-filter',
    password: process.env.DB_PASSWORD,
    node_env: process.env.NODE_ENV,
    port: 5432,
    rabbit_mq: process.env.RABBIT_MQ,
};
