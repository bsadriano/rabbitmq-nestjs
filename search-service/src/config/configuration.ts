export default () => ({
  port: process.env.PORT,
  auction_service: {
    url: process.env.AUCTION_SERVICE_URL,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  graphql: {
    endpoint: process.env.GRAPHQL_ENDPOINT,
  },
  rmq: {
    uri: process.env.RMQ_URI,
  },
});
