#!/bin/bash
npx kill-port 7001 7002 7003 7004 8080
cd "auction-service"
npm run start:dev &

cd ..
cd "auth-service"
npm run start:dev &

cd ..
cd "gateway-service"
npm run start &

cd ..
cd "search-service"
npm run start:dev

cd ..
cd "bid-service"
npm run start &
