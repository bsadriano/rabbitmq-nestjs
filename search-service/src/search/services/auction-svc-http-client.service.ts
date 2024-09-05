import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { AuctionResponseDto } from '../dto/auction-response.dto';
import { Item } from '../entities/item.entity';

@Injectable()
export class AuctionSvcHttpClientService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getItemsForSearchDb(): Promise<AuctionResponseDto[]> {
    var lastUpdated = await this.itemRepository.findOne({
      select: ['updatedAt'],
      order: { updatedAt: 'DESC' },
    });

    var auctionURL = this.configService.get<string>('auction_service.url');

    if (!auctionURL) {
      throw new Error('Argument cannot be null');
    }

    var url = auctionURL + '/api/auctions';

    if (lastUpdated !== null && lastUpdated.updatedAt) {
      url += `?date=${lastUpdated.updatedAt.toString().replace('T', ' ').substring(0, 19)}`;
    }

    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );

    return data ?? [];
  }
}
