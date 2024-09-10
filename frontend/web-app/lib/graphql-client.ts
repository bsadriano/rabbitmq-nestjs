import { GraphQLClient } from "graphql-request";
import "dotenv/config";

export const graphqlClient = (Authorization: string) => {
  return new GraphQLClient(process.env.DATABASE_API_URL as string, {
    headers: {
      Authorization,
    },
  });
};
