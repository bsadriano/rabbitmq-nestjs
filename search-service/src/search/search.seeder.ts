import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { AuctionSvcHttpClientService } from './services/auction-svc-http-client.service';

@Injectable()
export class SearchSeeder implements Seeder {
  private logger = new Logger('Search Seeder');

  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private readonly auctionSvcHttpClient: AuctionSvcHttpClientService,
  ) {}

  async seed(): Promise<any> {
    const items = await this.auctionSvcHttpClient.getItemsForSearchDb();

    this.logger.verbose(`${items.length} returned from auction service`);

    if (items.length > 0) {
      const newItems = items.map((item) =>
        this.itemRepository.create({ ...item, carModel: item.model }),
      );
      await this.itemRepository.save(newItems);
    }
  }

  drop(): Promise<any> {
    return this.itemRepository.delete({});
  }
}
