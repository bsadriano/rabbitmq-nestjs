import { graphql } from "../../gql";
import { Auction, PagedResult } from "../types";
import { graphqlClient } from "@/lib/graphql-client";

const GetAllItemsDocument = graphql(`
  query GetAllItemsQuery(
    $pageSize: Int!
    $pageNumber: Int!
    $searchTerm: String
    $seller: String
    $winner: String
    $orderBy: String
    $filterBy: String
  ) {
    items(
      pageSize: $pageSize
      pageNumber: $pageNumber
      searchTerm: $searchTerm
      seller: $seller
      winner: $winner
      orderBy: $orderBy
      filterBy: $filterBy
    ) {
      id
      createdAt
      updatedAt
      auctionEnd
      reservePrice
      auctionEnd
      make
      seller
      soldAmount
      currentHighBid
      carModel
      color
      year
      mileage
      imageUrl
    }
  }
`);

type Params = {
  pageSize: number;
  pageNumber: number;
  searchTerm?: string;
  seller?: string;
  winner?: string;
  orderBy?: string;
  filterBy?: string;
};

export const getData = async (params: Params): Promise<Auction[]> => {
  const { items } = await graphqlClient.request(GetAllItemsDocument, params);

  return items.map((item) => ({
    ...item,
    model: item.carModel,
    status: "",
  }));
};
