"use server";

import agent, { ErrorResponse, PlaceBidRequestDto } from "@/app/lib/agent";
import { Auction, AuctionConnection, Bid } from "@/app/types";
import { auth } from "@/auth";
import { graphql } from "@/gql";
import { graphqlClient } from "@/lib/graphql-client";
import { revalidatePath } from "next/cache";
import { FieldValues } from "react-hook-form";

const GetAllItemsDocument = graphql(`
  query GetAllItemsQuery(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $searchTerm: String
    $seller: String
    $winner: String
    $orderBy: String
    $filterBy: String
    $next: Boolean!
    $prev: Boolean!
  ) {
    biItems(
      first: $first
      after: $after
      last: $last
      before: $before
      searchTerm: $searchTerm
      seller: $seller
      winner: $winner
      orderBy: $orderBy
      filterBy: $filterBy
      next: $next
      prev: $prev
    ) {
      next {
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
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
      }

      prev {
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
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
      }
    }
  }
`);

type Params = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  searchTerm?: string;
  seller?: string;
  winner?: string;
  orderBy?: string;
  filterBy?: string;
  next: boolean;
  prev: boolean;
};

export const getData = async (params: Params): Promise<AuctionConnection> => {
  try {
    const session = await auth();
    const token = session?.accessToken ?? "";
    const { biItems } = await graphqlClient(token).request(
      GetAllItemsDocument,
      params
    );

    if (biItems.next === null && biItems.prev === null) {
      return {
        next: null,
        prev: null,
      };
    }

    const items: AuctionConnection = {};
    if (biItems.next) {
      items.next = {
        pageInfo: {
          endCursor: biItems.next.pageInfo.endCursor ?? null,
          startCursor: biItems.next.pageInfo.startCursor ?? null,
          hasNextPage: biItems.next.pageInfo.hasNextPage,
          hasPreviousPage: biItems.next.pageInfo.hasPreviousPage,
        },
        edges: biItems.next.edges.map((edge) => ({
          ...edge,
          node: {
            ...edge.node,
            model: edge.node.carModel,
            status: "",
            seller: edge.node.seller ?? null,
            soldAmount: edge.node.soldAmount ?? null,
            currentHighBid: edge.node.currentHighBid ?? null,
          },
        })),
      };
    }

    if (biItems.prev) {
      items.prev = {
        pageInfo: {
          endCursor: biItems.prev.pageInfo.endCursor ?? null,
          startCursor: biItems.prev.pageInfo.startCursor ?? null,
          hasNextPage: biItems.prev.pageInfo.hasNextPage,
          hasPreviousPage: biItems.prev.pageInfo.hasPreviousPage,
        },
        edges: biItems.prev.edges.map((edge) => ({
          ...edge,
          node: {
            ...edge.node,
            model: edge.node.carModel,
            status: "",
            seller: edge.node.seller ?? null,
            soldAmount: edge.node.soldAmount ?? null,
            currentHighBid: edge.node.currentHighBid ?? null,
          },
        })),
      };
    }

    return items;
  } catch (err: any) {
    console.log(err.message);

    return {
      next: null,
      prev: null,
    };
  }
};

export async function createAuction(data: FieldValues) {
  return await agent.Auctions.create(data);
}

export async function getDetailedViewData(
  id: string
): Promise<Auction | ErrorResponse> {
  return await agent.Auctions.show(id);
}

export async function updateAuction(id: string, data: FieldValues) {
  const res = await agent.Auctions.update(id, data);
  revalidatePath(`/auctions/${id}`);
  return res;
}

export async function deleteAuction(id: string) {
  return await agent.Auctions.delete(id);
}

export async function getBidsForAuction(id: string): Promise<Bid[]> {
  return await agent.Bids.get(id);
}

export async function placeBidForAuction(body: PlaceBidRequestDto) {
  return await agent.Bids.placeBidForAuction(body);
}
