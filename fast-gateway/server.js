const gateway = require("fast-gateway");
const server = gateway({
  routes: [
    {
      prefix: "/api/auth*",
      target: "http://localhost:7003",
    },
    {
      prefix: "/api/auctions*",
      target: "http://localhost:7001",
    },
    {
      prefix: "/api/search*",
      target: "http://localhost:7002",
    },
  ],
});

server.start(8080);
console.info("gateway http server listening on ::8080");
