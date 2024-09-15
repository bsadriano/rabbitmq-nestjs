import { getFullName } from '@bsadriano/rmq-nestjs-lib';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAuctionRequest, GrpcAuctionResponse } from 'proto/auction';
import { Auction } from 'src/auction/entities/auction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GrpcAuctionService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
  ) {}

  async getAuction({ id }: GetAuctionRequest): Promise<GrpcAuctionResponse> {
    const auction = await this.auctionRepository.findOne({
      relations: ['seller'],
      where: {
        id,
      },
    });

    if (!auction) {
      throw new RpcException(`Auction with id #${id} not found`);
    }

    return {
      auction: {
        auctionEnd: auction.auctionEnd,
        id: auction.id,
        reservePrice: auction.reservePrice,
        seller: getFullName(auction.seller.firstName, auction.seller.lastName),
      },
    } satisfies GrpcAuctionResponse;
  }
}
