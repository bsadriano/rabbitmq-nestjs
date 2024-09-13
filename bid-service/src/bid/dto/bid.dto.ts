import { Expose } from 'class-transformer';
import { BidStatus } from 'src/schemas/bid-status.enum';

export class BidDto {
  @Expose()
  id: number;

  @Expose()
  auctionId: number;

  @Expose()
  seller: string;

  @Expose()
  createdAt: string;

  @Expose()
  amount: number;

  @Expose()
  bidStatus: BidStatus;
}
