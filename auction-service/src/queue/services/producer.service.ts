import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { UpdateAuctionDto } from 'src/auction/dto/update-auction.dto';
import { Auction } from 'src/auction/entities/auction.entity';
import { AUCTION_SERVICE } from 'src/constants/services';
import { AuctionCreated } from '../contracts/auction-created';
import { AuctionUpdated } from '../contracts/auction-updated';
import { AuctionDeleted } from '../contracts/auction-deleted';

@Injectable()
export class ProducerService {
  constructor(@Inject(AUCTION_SERVICE) private rabbitClient: ClientProxy) {}

  createAuction(auction: Auction) {
    const auctionCreated = plainToInstance(AuctionCreated, auction, {
      excludeExtraneousValues: true,
    });

    this.rabbitClient.emit('auction-created', auctionCreated);
  }

  updateAuction(id: number, updateAuctionDto: UpdateAuctionDto) {
    const auctionUpdated = {
      id,
      ...updateAuctionDto,
    } as AuctionUpdated;

    this.rabbitClient.emit('auction-updated', auctionUpdated);
  }

  deleteAuction(id: number) {
    this.rabbitClient.emit(`auction-deleted`, { id } as AuctionDeleted);
  }
}
