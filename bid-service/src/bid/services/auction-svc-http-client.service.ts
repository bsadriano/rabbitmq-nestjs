import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { Model } from 'mongoose';
import { catchError, firstValueFrom, of } from 'rxjs';
import { Auction } from 'src/schemas/auction.schema';
import { AuctionResponseDto } from '../dto/auction-response.dto';

@Injectable()
export class AuctionSvcHttpClientService {
  private logger = new Logger(AuctionSvcHttpClientService.name);

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getItemsForSearchDb(): Promise<AuctionResponseDto[]> {
    try {
      const lastUpdated = await this.auctionModel
        .findOne({})
        .select('updatedAt')
        .sort('-updatedAt');

      const auctionURL = this.configService.get<string>('auction_service.url');

      if (!auctionURL) {
        throw new Error('Argument cannot be null');
      }

      let url = auctionURL + '/seed';

      if (lastUpdated !== null && lastUpdated.updatedAt) {
        url += `?date=${format(lastUpdated.updatedAt, 'yyyy-MM-dd HH:mm:ss')}`;
      }

      console.log({
        url,
      });

      const { data } = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError) => {
            this.logger.log('Error in grpc: ' + error.message);
            return of(null);
          }),
        ),
      );

      return data ?? [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
