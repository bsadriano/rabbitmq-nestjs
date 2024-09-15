#!/bin/bash
cd "auction-service"
npm uninstall @bsadriano/rmq-nestjs-lib
npm install @bsadriano/rmq-nestjs-lib

cd ..
cd "auth-service"
npm uninstall @bsadriano/rmq-nestjs-lib
npm install @bsadriano/rmq-nestjs-lib

cd ..
cd "search-service"
npm uninstall @bsadriano/rmq-nestjs-lib
npm install @bsadriano/rmq-nestjs-lib

cd ..
cd "bid-service"
npm uninstall @bsadriano/rmq-nestjs-lib
npm install @bsadriano/rmq-nestjs-lib
