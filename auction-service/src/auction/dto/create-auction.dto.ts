import { Transform } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @Min(1930)
  @Max(2050)
  year: number;

  @IsString()
  color: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  mileage: number;

  @IsString()
  imageUrl: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  reservePrice: number;

  @IsString()
  auctionEnd: string;
}
