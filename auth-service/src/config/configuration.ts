export default () => ({
  port: process.env.PORT,
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE,
  },
  jwt: {
    access_expiration: process.env.JWT_ACCESS_EXPIRATION,
    refresh_expiration: process.env.JWT_REFRESH_EXPIRATION,
    secret: process.env.JWT_SECRET,
  },
  rmq: {
    uri: process.env.RMQ_URI,
  },
});
