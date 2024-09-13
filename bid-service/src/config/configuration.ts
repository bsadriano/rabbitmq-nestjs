export default () => ({
  auction_service: {
    url: process.env.AUCTION_SERVICE_URL,
  },
  rmq: {
    uri: process.env.RMQ_URI,
    auction_queue: process.env.RMQ_AUCTION_QUEUE,
    auth_queue: process.env.RMQ_AUTH_QUEUE,
    auction_finished_queue: process.env.RMQ_AUCTION_FINISHED_QUEUE,
    auction_bid_placed_queue: process.env.RMQ_AUCTION_BID_PLACED_QUEUE,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
});
