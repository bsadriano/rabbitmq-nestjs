const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");

const app = express();

const auctionsProxy = createProxyMiddleware({
  target: "http://localhost:7001/api/auctions",
  changeOrigin: true,
  pathRewrite: { "^/api/auth": "" },
});

const authProxy = createProxyMiddleware({
  target: "http://localhost:7003/api/auth",
  changeOrigin: true,
  pathRewrite: { "^/api/auth": "" },
});

const graphqlProxy = createProxyMiddleware({
  target: "http://localhost:7002/graphql",
  changeOrigin: true,
  pathRewrite: { "^/graphql": "" },
});

app.use("/api/auctions", auctionsProxy);
app.use("/api/auth", authProxy);
app.use("/graphql", graphqlProxy);

app.listen(8080, () => {
  console.log("Proxy server listening on port 8080");
});
