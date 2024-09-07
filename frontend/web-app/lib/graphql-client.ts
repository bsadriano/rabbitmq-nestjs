import { GraphQLClient } from "graphql-request";
import "dotenv/config";

export const graphqlClient = new GraphQLClient(
  process.env.DATABASE_API_URL as string
);
