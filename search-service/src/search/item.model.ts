import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field(() => ID)
  id: number;

  @Field(() => Float)
  reservePrice: number;

  @Field({ nullable: true })
  seller?: string;

  @Field({ nullable: true })
  winner?: string;

  @Field(() => Float, { nullable: true })
  soldAmount?: number;

  @Field(() => Float, { nullable: true })
  currentHighBid?: number;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field()
  auctionEnd: string;

  @Field()
  make: string;

  @Field()
  year: number;

  @Field()
  carModel: string;

  @Field()
  color: string;

  @Field(() => Int)
  mileage: number;

  @Field()
  imageUrl: string;
}
