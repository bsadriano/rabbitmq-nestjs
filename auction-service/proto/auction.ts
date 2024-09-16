// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.1
// source: proto/auction.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auction";

export interface GetAuctionRequest {
  id: number;
}

export interface GrpcAuctionModel {
  id: number;
  seller: string;
  auctionEnd: string;
  reservePrice: number;
  updatedAt: string;
}

export interface GrpcAuctionResponse {
  auction: GrpcAuctionModel | undefined;
}

export const AUCTION_PACKAGE_NAME = "auction";

export interface GrpcAuctionClient {
  getAuction(request: GetAuctionRequest): Observable<GrpcAuctionResponse>;
}

export interface GrpcAuctionController {
  getAuction(
    request: GetAuctionRequest,
  ): Promise<GrpcAuctionResponse> | Observable<GrpcAuctionResponse> | GrpcAuctionResponse;
}

export function GrpcAuctionControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAuction"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("GrpcAuction", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("GrpcAuction", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const GRPC_AUCTION_SERVICE_NAME = "GrpcAuction";
