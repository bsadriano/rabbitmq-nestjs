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
  grpc: {
    uri: process.env.GRPC_URI,
  },
  rmq: {
    uri: process.env.RMQ_URI,
  },
});
