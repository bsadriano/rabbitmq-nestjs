import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.DATABASE_API_URL,
  documents: "app/**/*.{tsx,ts}",
  ignoreNoDocuments: true,
  generates: {
    "gql/": {
      preset: "client",
      plugins: [],
    },
    "schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
