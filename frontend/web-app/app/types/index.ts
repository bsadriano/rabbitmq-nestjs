export type PagedResult<T> = {
  results: T[];
  pageCount: number;
  totalCount: number;
};

export type Auction = {
  reservePrice: number;
  seller?: string | null | undefined;
  winner?: string;
  soldAmount?: number | null | undefined;
  currentHighBid?: number | null | undefined;
  createdAt: string;
  updatedAt: string;
  auctionEnd: string;
  status: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  imageUrl: string;
  id: string;
};

export type AuctionEdge = {
  cursor: string;
  node: Auction;
};

export type AuctionConnection = {
  next?: {
    pageInfo: {
      endCursor: string | null | undefined;
      hasNextPage: boolean | null | undefined;
      hasPreviousPage: boolean | null | undefined;
      startCursor: string | null | undefined;
    };
    edges: AuctionEdge[];
  } | null;
  prev?: {
    pageInfo: {
      endCursor: string | null | undefined;
      hasNextPage: boolean | null | undefined;
      hasPreviousPage: boolean | null | undefined;
      startCursor: string | null | undefined;
    };
    edges: AuctionEdge[];
  } | null;
};

export type Bid = {
  id: string;
  auctionId: string;
  bidder: string;
  bidTime: string;
  amount: number;
  bidStatus: string;
};

export type AuctionFinished = {
  itemSold: boolean;
  auctionId: string;
  winner?: string;
  seller: string;
  amount?: number;
};
