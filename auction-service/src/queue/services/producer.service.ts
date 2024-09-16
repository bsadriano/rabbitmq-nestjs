import {
  AuctionCreatedDto,
  AuctionUpdatedDto,
} from '@bsadriano/rmq-nestjs-lib';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UpdateAuctionDto } from 'src/auction/dto/update-auction.dto';
import { Auction } from 'src/auction/entities/auction.entity';
import {
  AUCTION_CREATED_EXCHANGE_NAME,
  AUCTION_CREATED_ROUTING_KEY,
  AUCTION_DELETED_EXCHANGE_NAME,
  AUCTION_DELETED_ROUTING_KEY,
  AUCTION_UPDATED_EXCHANGE_NAME,
  AUCTION_UPDATED_ROUTING_KEY,
  AUTH_EXCHANGE,
  AUTH_VALIDATE_USER_ROUTING_KEY,
} from 'src/constants/services';

@Injectable()
export class ProducerService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  createAuction(auction: Auction) {
    const auctionCreated = plainToInstance(AuctionCreatedDto, auction, {
      excludeExtraneousValues: true,
    });

    this.amqpConnection.publish(
      AUCTION_CREATED_EXCHANGE_NAME,
      AUCTION_CREATED_ROUTING_KEY,
      {
        message: auctionCreated,
      },
    );
  }

  updateAuction(id: number, updateAuctionDto: UpdateAuctionDto) {
    const auctionUpdated = {
      id,
      ...updateAuctionDto,
    } as AuctionUpdatedDto;

    this.amqpConnection.publish(
      AUCTION_UPDATED_EXCHANGE_NAME,
      AUCTION_UPDATED_ROUTING_KEY,
      {
        message: auctionUpdated,
      },
    );
  }

  deleteAuction(id: number) {
    this.amqpConnection.publish(
      AUCTION_DELETED_EXCHANGE_NAME,
      AUCTION_DELETED_ROUTING_KEY,
      {
        message: { id },
      },
    );
  }

  validateUser(authentication: string) {
    return this.amqpConnection.request({
      exchange: AUTH_EXCHANGE,
      routingKey: AUTH_VALIDATE_USER_ROUTING_KEY,
      payload: {
        message: {
          Authentication: authentication,
        },
      },
      headers: {
        Authentication: authentication,
      },
    });
  }
}
