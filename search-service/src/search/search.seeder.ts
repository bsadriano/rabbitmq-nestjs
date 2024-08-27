import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Item } from './item.model';
import { AuctionSvcHttpClientService } from './services/auction-svc-http-client.service';

@Injectable()
export class SearchSeeder implements Seeder {
  private logger = new Logger('Search Seeder');

  constructor(
    @InjectModel(Item.name) private readonly item: Model<Item>,
    private readonly auctionSvcHttpClient: AuctionSvcHttpClientService,
  ) {}

  async seed(): Promise<any> {
    const items = await this.auctionSvcHttpClient.getItemsForSearchDb();

    this.logger.verbose(`${items.length} returned from auction service`);

    if (items.length > 0) {
      await this.item.insertMany(
        items.map((item) => ({ ...item, carModel: item.model })),
      );
    }
  }

  drop(): Promise<any> {
    return this.item.deleteMany({});
  }
}
