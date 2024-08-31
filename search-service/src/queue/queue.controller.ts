import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SearchService } from 'src/search/services/search.service';
import { CreateItemInput } from 'src/search/dto/item.inputs';
import { RmqService } from 'src/rmq/rmq.service';
import { AuctionCreated } from './dto/auction-created.dto';
import { AuctionUpdated } from './dto/auction-updated';
import { AuctionDeleted } from './dto/auction-deleted.dto';
import { AuctionFinished } from 'src/search/dto/auction-finished.dto';
import { AuctionBidPlaced } from 'src/search/dto/auction-bid-placed.dto';

@Controller()
export class QueueController {
  private logger = new Logger('QueueController');

  constructor(
    private searchService: SearchService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('auction-created')
  async handleAuctionCreated(
    @Payload() data: AuctionCreated,
    @Ctx() context: RmqContext,
  ) {
    this.logger.verbose(
      `Handling auction added with data: "${JSON.stringify(data)}"`,
    );

    await this.searchService.create({
      ...data,
      carModel: data.model,
    } as CreateItemInput);

    this.rmqService.ack(context);

    this.logger.verbose('Successfully added auction ');
  }

  @EventPattern('auction-updated')
  async handleAuctionUpdated(
    @Payload() data: AuctionUpdated,
    @Ctx() context: RmqContext,
  ) {
    this.logger.verbose(
      `Handling auction updated with id #${data.id}, and data: "${JSON.stringify(data)}"`,
    );

    await this.searchService.update(data);

    this.rmqService.ack(context);

    this.logger.verbose('Successfully updated auction');
  }

  @EventPattern('auction-deleted')
  async handleAuctionDeleted(
    @Payload() { id }: AuctionDeleted,
    @Ctx() context: RmqContext,
  ) {
    this.logger.verbose(`Handling auction deleted with id #${id}`);

    await this.searchService.deleteById(id);

    this.rmqService.ack(context);

    this.logger.verbose('Successfully deleted auction');
  }

  @EventPattern('auction-finished')
  async handleAuctionFinished(
    @Payload() auctionFinished: AuctionFinished,
    @Ctx() context: RmqContext,
  ) {
    this.logger.verbose('Consuming auction finished');

    await this.searchService.finishAuction(auctionFinished);

    this.rmqService.ack(context);
  }

  @EventPattern('auction-bid-placed')
  async handleBidPlaced(
    @Payload() auctionBidPlaced: AuctionBidPlaced,
    @Ctx() context: RmqContext,
  ) {
    this.logger.verbose('Consuming bid placed');

    await this.searchService.placeBid(auctionBidPlaced);

    this.rmqService.ack(context);
  }
}
