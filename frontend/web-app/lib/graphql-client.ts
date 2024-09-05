import { GraphQLClient } from "graphql-request";
import "dotenv/config";

console.log("api: ", process.env.DATABASE_API_URL);

export const graphqlClient = new GraphQLClient(
  process.env.DATABASE_API_URL as string
);
