export const AUTH_SERVICE = 'RMQ_AUTH';
export const AUTH_QUEUE = 'auth';

export const AUCTION_CREATED_EXCHANGE_NAME = 'auction-created-exchange';
export const AUCTION_CREATED_ROUTING_KEY = 'auction-created-event';
export const AUCTION_UPDATED_EXCHANGE_NAME = 'auction-updated-exchange';
export const AUCTION_UPDATED_ROUTING_KEY = 'auction-updated-event';
export const AUCTION_DELETED_EXCHANGE_NAME = 'auction-deleted-exchange';
export const AUCTION_DELETED_ROUTING_KEY = 'auction-deleted-event';
export const AUCTION_BID_PLACED_EXCHANGE_NAME = 'auction-bid_placed-exchange';
export const AUCTION_BID_PLACED_ROUTING_KEY = 'auction-bid_placed-event';
export const AUCTION_FINISHED_EXCHANGE_NAME = 'auction-finished-exchange';
export const AUCTION_FINISHED_ROUTING_KEY = 'auction-finished-event';

export const USER_EXCHANGE = 'user-exchange';
export const USER_SERVICE = 'user';
export const USER_CMD_VALIDATE = 'validate';
export const USER_CMD_CREATE = 'create';
export const USER_CMD_GET_USERS = 'get-users';
export const USER_CMD_GET_USER_BY_ID = 'get-user-by-id';
export const USER_VALIDATE_ROUTING_KEY = 'user.cmd.validate';
