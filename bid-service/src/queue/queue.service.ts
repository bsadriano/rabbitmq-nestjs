import { AuctionCreatedDto } from '@bsadriano/rmq-nestjs-lib';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from 'src/schemas/bid.schema';

@Injectable()
export class QueueService {
  constructor(@InjectModel(Bid.name) private bidModel: Model<Bid>) {}

  async create(payload: AuctionCreatedDto) {
    return await this.bidModel.create(payload);
  }
}
