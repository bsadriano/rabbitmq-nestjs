export default () => ({
  rmq: {
    uri: process.env.RMQ_URI,
    auction_queue: process.env.RMQ_AUCTION_QUEUE,
  },
});
