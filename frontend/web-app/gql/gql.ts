/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetAllItemsQuery(\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n    $searchTerm: String\n    $seller: String\n    $winner: String\n    $orderBy: String\n    $filterBy: String\n    $next: Boolean!\n    $prev: Boolean!\n  ) {\n    biItems(\n      first: $first\n      after: $after\n      last: $last\n      before: $before\n      searchTerm: $searchTerm\n      seller: $seller\n      winner: $winner\n      orderBy: $orderBy\n      filterBy: $filterBy\n      next: $next\n      prev: $prev\n    ) {\n      next {\n        pageInfo {\n          endCursor\n          startCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          cursor\n          node {\n            id\n            createdAt\n            updatedAt\n            auctionEnd\n            reservePrice\n            auctionEnd\n            make\n            seller\n            soldAmount\n            currentHighBid\n            carModel\n            color\n            year\n            mileage\n            imageUrl\n          }\n        }\n      }\n\n      prev {\n        pageInfo {\n          endCursor\n          startCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          cursor\n          node {\n            id\n            createdAt\n            updatedAt\n            auctionEnd\n            reservePrice\n            auctionEnd\n            make\n            seller\n            soldAmount\n            currentHighBid\n            carModel\n            color\n            year\n            mileage\n            imageUrl\n          }\n        }\n      }\n    }\n  }\n": types.GetAllItemsQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllItemsQuery(\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n    $searchTerm: String\n    $seller: String\n    $winner: String\n    $orderBy: String\n    $filterBy: String\n    $next: Boolean!\n    $prev: Boolean!\n  ) {\n    biItems(\n      first: $first\n      after: $after\n      last: $last\n      before: $before\n      searchTerm: $searchTerm\n      seller: $seller\n      winner: $winner\n      orderBy: $orderBy\n      filterBy: $filterBy\n      next: $next\n      prev: $prev\n    ) {\n      next {\n        pageInfo {\n          endCursor\n          startCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          cursor\n          node {\n            id\n            createdAt\n            updatedAt\n            auctionEnd\n            reservePrice\n            auctionEnd\n            make\n            seller\n            soldAmount\n            currentHighBid\n            carModel\n            color\n            year\n            mileage\n            imageUrl\n          }\n        }\n      }\n\n      prev {\n        pageInfo {\n          endCursor\n          startCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          cursor\n          node {\n            id\n            createdAt\n            updatedAt\n            auctionEnd\n            reservePrice\n            auctionEnd\n            make\n            seller\n            soldAmount\n            currentHighBid\n            carModel\n            color\n            year\n            mileage\n            imageUrl\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllItemsQuery(\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n    $searchTerm: String\n    $seller: String\n    $winner: String\n    $orderBy: String\n    $filterBy: String\n    $next: Boolean!\n    $prev: Boolean!\n  ) {\n    biItems(\n      first: $first\n      after: $after\n      last: $last\n      before: $before\n      searchTerm: $searchTerm\n      seller: $seller\n      winner: $winner\n      orderBy: $orderBy\n      filterBy: $filterBy\n      next: $next\n      prev: $prev\n    ) {\n      next {\n        pageInfo {\n          endCursor\n          startCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          cursor\n          node {\n            id\n            createdAt\n            updatedAt\n            auctionEnd\n            reservePrice\n            auctionEnd\n            make\n            seller\n            soldAmount\n            currentHighBid\n            carModel\n            color\n            year\n            mileage\n            imageUrl\n          }\n        }\n      }\n\n      prev {\n        pageInfo {\n          endCursor\n          startCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          cursor\n          node {\n            id\n            createdAt\n            updatedAt\n            auctionEnd\n            reservePrice\n            auctionEnd\n            make\n            seller\n            soldAmount\n            currentHighBid\n            carModel\n            color\n            year\n            mileage\n            imageUrl\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;