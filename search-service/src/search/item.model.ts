import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
export class Item {
  @Field((type) => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field((type) => Float)
  id: number;

  @Field((type) => Float)
  reservePrice: number;

  @Field()
  seller: string;

  @Field()
  winner: string;

  @Field((type) => Float)
  soldAmount: number;

  @Field((type) => Float)
  currentHighBid: number;

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
}

export const ItemSchema = SchemaFactory.createForClass(Item);
