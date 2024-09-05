/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateItemInput = {
  auctionEnd: Scalars['String']['input'];
  carModel: Scalars['String']['input'];
  color: Scalars['String']['input'];
  imageUrl: Scalars['String']['input'];
  make: Scalars['String']['input'];
  mileage: Scalars['Int']['input'];
  reservePrice: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};

export type Item = {
  __typename?: 'Item';
  _id: Scalars['ID']['output'];
  auctionEnd: Scalars['String']['output'];
  carModel: Scalars['String']['output'];
  color: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currentHighBid: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  imageUrl: Scalars['String']['output'];
  make: Scalars['String']['output'];
  mileage: Scalars['Int']['output'];
  reservePrice: Scalars['Float']['output'];
  seller: Scalars['String']['output'];
  soldAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  winner: Scalars['String']['output'];
  year: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createItem: Item;
};


export type MutationCreateItemArgs = {
  payload: CreateItemInput;
};

export type Query = {
  __typename?: 'Query';
  item: Item;
  items: Array<Item>;
};


export type QueryItemArgs = {
  _id: Scalars['String']['input'];
};


export type QueryItemsArgs = {
  filterBy?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  pageNumber?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  seller?: InputMaybe<Scalars['String']['input']>;
  winner?: InputMaybe<Scalars['String']['input']>;
};

export type GetAllItemsQueryQueryVariables = Exact<{
  pageSize: Scalars['Int']['input'];
  pageNumber: Scalars['Int']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  seller?: InputMaybe<Scalars['String']['input']>;
  winner?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  filterBy?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllItemsQueryQuery = { __typename?: 'Query', items: Array<{ __typename?: 'Item', id: number, createdAt: string, updatedAt: string, auctionEnd: string, reservePrice: number, make: string, seller: string, soldAmount: number, currentHighBid: number, carModel: string, color: string, year: number, mileage: number, imageUrl: string }> };


export const GetAllItemsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllItemsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seller"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"winner"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}},{"kind":"Argument","name":{"kind":"Name","value":"seller"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seller"}}},{"kind":"Argument","name":{"kind":"Name","value":"winner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"winner"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"auctionEnd"}},{"kind":"Field","name":{"kind":"Name","value":"reservePrice"}},{"kind":"Field","name":{"kind":"Name","value":"auctionEnd"}},{"kind":"Field","name":{"kind":"Name","value":"make"}},{"kind":"Field","name":{"kind":"Name","value":"seller"}},{"kind":"Field","name":{"kind":"Name","value":"soldAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currentHighBid"}},{"kind":"Field","name":{"kind":"Name","value":"carModel"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"mileage"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<GetAllItemsQueryQuery, GetAllItemsQueryQueryVariables>;