export default () => ({
  port: process.env.PORT,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE,
  },
  jwt: {
    expiration: process.env.JWT_EXPIRATION,
    secret: process.env.JWT_SECRET,
  },
  rmq: {
    uri: process.env.RMQ_URI,
    auction_queue: process.env.RMQ_AUCTION_QUEUE,
    auth_queue: process.env.RMQ_AUTH_QUEUE,
    user_queue: process.env.RMQ_USER_QUEUE,
  },
});
