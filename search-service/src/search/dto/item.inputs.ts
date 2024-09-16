import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  reservePrice: number;

  @Field()
  @IsDateString()
  auctionEnd: string;

  @Field()
  @IsString()
  make: string;

  @Field(() => Int)
  @Min(1930)
  @Max(2050)
  year: number;

  @Field()
  @IsString()
  carModel: string;

  @Field()
  @IsString()
  color: string;

  @Field(() => Int)
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Field()
  imageUrl: string;
}
