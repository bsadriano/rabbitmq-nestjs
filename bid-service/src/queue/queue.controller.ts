import { AuctionCreatedDto, RmqService } from '@bsadriano/rmq-nestjs-lib';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { QueueService } from './queue.service';

@Controller()
export class QueueController {
  private logger = new Logger('QueueController');

  constructor(
    private queueService: QueueService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('auction-created')
  async handleAuctionCreated(
    @Payload() data: AuctionCreatedDto,
    @Ctx() context: RmqContext,
  ) {
    this.logger.verbose(
      `Handling auction added with data: "${JSON.stringify(data)}"`,
    );

    await this.queueService.create(data);

    this.rmqService.ack(context);

    this.logger.verbose('Successfully added auction ');
  }
}
