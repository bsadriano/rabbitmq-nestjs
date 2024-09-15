import { IsPositive } from 'class-validator';
import { GetAuctionRequest } from 'proto/auction';

export class GetAuctionRequestDto implements GetAuctionRequest {
  @IsPositive()
  id: number;
}
