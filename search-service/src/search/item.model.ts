import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Node } from '../node/Node';
import { toGlobalId } from 'graphql-relay';

@ObjectType({ implements: Node })
export class Item {
  @Field((type) => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field((type) => Float)
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

  @Field(() => ID, { name: 'id' })
  get relayId(): string {
    return toGlobalId('Recipe', this.id);
  }
}

export const ItemSchema = SchemaFactory.createForClass(Item);
