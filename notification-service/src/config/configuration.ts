export default () => ({
  port: process.env.PORT,
  auction_service: {
    url: process.env.AUCTION_SERVICE_URL,
  },
  rmq: {
    uri: process.env.RMQ_URI,
  },
});
