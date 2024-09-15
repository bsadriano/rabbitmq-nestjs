import { IsPositive } from 'class-validator';

export class PlaceBidRequestDto {
  @IsPositive()
  auctionId: number;

  @IsPositive()
  amount: number;
}
