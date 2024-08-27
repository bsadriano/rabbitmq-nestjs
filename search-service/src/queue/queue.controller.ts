import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SearchService } from 'src/search/services/search.service';
import { AuctionCreated } from './contracts/auction-created';
import { CreateItemInput } from 'src/search/dto/item.inputs';
import { AuctionUpdated } from './contracts/auction-updated';
import { AuctionDeleted } from './contracts/auction-deleted';
import { RmqService } from 'src/rmq/rmq.service';

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
}
