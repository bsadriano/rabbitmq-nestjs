import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Auction } from 'src/schemas/auction.schema';
import { AuctionSvcHttpClientService } from './services/auction-svc-http-client.service';

@Injectable()
export class AuctionSeeder implements Seeder {
  private logger = new Logger(AuctionSeeder.name);

  constructor(
    @InjectModel(Auction.name) private readonly auction: Model<Auction>,
    private readonly auctionSvcHttpClient: AuctionSvcHttpClientService,
  ) {}

  async seed(): Promise<any> {
    const auctions = await this.auctionSvcHttpClient.getItemsForSearchDb();

    this.logger.verbose(`${auctions.length} returned from auction service`);

    if (auctions.length > 0) {
      await this.auction.insertMany(
        auctions.map(({ id, reservePrice, seller, updatedAt, auctionEnd }) => ({
          id,
          reservePrice,
          seller,
          updatedAt,
          auctionEnd,
        })),
      );
    }
  }

  drop(): Promise<any> {
    return this.auction.deleteMany({});
  }
}
