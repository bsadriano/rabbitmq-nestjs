import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field((type) => ID)
  id: number;

  @Field((type) => Float)
  reservePrice: number;

  @Field({ nullable: true })
  seller?: string;

  @Field({ nullable: true })
  winner?: string;

  @Field((type) => Float, { nullable: true })
  soldAmount?: number;

  @Field((type) => Float, { nullable: true })
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

  @Field((type) => Int)
  mileage: number;

  @Field()
  imageUrl: string;

  // @Field(() => ID, { name: '_id' })
  // get relayId(): string {
  //   return toGlobalId('Item', this.id);
  // }
}
