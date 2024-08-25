import { Expose, Transform } from 'class-transformer';
import { AuctionStatus } from '../entities/auction-status.enum';
import { Item } from '../entities/item.entity';
import { Auction } from '../entities/auction.entity';

export class AuctionDto {
  @Expose()
  id: number;

  @Expose()
  reservePrice: number;

  @Expose()
  seller: string;

  @Expose()
  winner: string;

  @Expose()
  soldAmount: string;

  @Expose()
  currentHighBid: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  auctionEnd: string;

  @Expose()
  status: AuctionStatus;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.make)
  make: string;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.model)
  model: string;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.year)
  year: number;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.color)
  color: string;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.mileage)
  mileage: number;

  @Expose()
  @Transform(({ obj }: { obj: Auction }) => obj.item.imageUrl)
  imageUrl: string;
}
