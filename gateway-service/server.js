const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");

const app = express();

const auctionsProxy = createProxyMiddleware({
  target: "http://localhost:7001/api/auctions",
  changeOrigin: true,
  pathRewrite: { "^/api/auctions": "" },
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

const bidsProxy = createProxyMiddleware({
  target: "http://localhost:7004/api/bids",
  changeOrigin: true,
  pathRewrite: { "^/api/bids": "" },
});

const wsProxy = createProxyMiddleware({
  target: "http://localhost:7005",
  changeOrigin: true,
  pathRewrite: { "^/ws": "" },
});

app.use("/api/auctions", auctionsProxy);
app.use("/api/auth", authProxy);
app.use("/api/bids", bidsProxy);
app.use("/graphql", graphqlProxy);
app.use("/ws", wsProxy);

app.listen(8080, () => {
  console.log("Proxy server listening on port 8080");
});
