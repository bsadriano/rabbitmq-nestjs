export default () => ({
  auction_service: {
    url: process.env.AUCTION_SERVICE_URL,
  },
  rmq: {
    uri: process.env.RMQ_URI,
    auction_queue: process.env.RMQ_AUCTION_QUEUE,
    auth_queue: process.env.RMQ_AUTH_QUEUE,
  },
});
