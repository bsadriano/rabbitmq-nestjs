import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { Item } from '../item.schema';
import { AuctionResponseDto } from '../dto/auction-response.dto';
import { format } from 'date-fns';

@Injectable()
export class AuctionSvcHttpClientService {
  constructor(
    // @InjectModel(Item.name) private itemModel: Model<Item>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getItemsForSearchDb(): Promise<AuctionResponseDto[]> {
    // var lastUpdated = await this.itemModel
    //   .findOne({})
    //   .select('updatedAt')
    //   .sort('-updatedAt');

    var auctionURL = this.configService.get<string>('auction_service.url');

    if (!auctionURL) {
      throw new Error('Argument cannot be null');
    }

    var url = auctionURL + '/api/auctions/seed';

    // if (lastUpdated !== null && lastUpdated.updatedAt) {
    //   url += `?date=${format(lastUpdated.updatedAt, 'yyyy-MM-dd HH:mm:ss')}`;
    // }

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
