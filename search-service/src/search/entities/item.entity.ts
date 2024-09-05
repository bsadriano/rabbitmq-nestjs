import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { toGlobalId } from 'graphql-relay';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Node } from '../../node/Node';

@ObjectType({ implements: Node })
@Entity('items')
export class Item implements Node {
  @PrimaryColumn()
  _id: string;

  @Field()
  @Column()
  id: number;

  @Field()
  @Column()
  reservePrice: number;

  @Field({ nullable: true })
  @Column({ default: null })
  seller?: string;

  @Field({ nullable: true })
  @Column({ default: null })
  winner?: string;

  @Field((type) => Float, { nullable: true })
  @Column({ default: 0 })
  soldAmount?: number;

  @Field((type) => Float, { nullable: true })
  @Column({ default: 0 })
  currentHighBid?: number;

  @Field()
  @Column({ type: Date, default: Date.now })
  createdAt: Date;

  @Field()
  @Column({ type: Date, default: Date.now })
  updatedAt: Date;

  @Field()
  @Column({ type: Date })
  auctionEnd: Date;

  @Field()
  @Column()
  make: string;

  @Field()
  @Column()
  year: number;

  @Field()
  @Column()
  carModel: string;

  @Field()
  @Column()
  color: string;

  @Field()
  @Column()
  mileage: number;

  @Field()
  @Column()
  imageUrl: string;

  @Field(() => ID, { name: '_id' })
  get relayId(): string {
    return toGlobalId('Item', this._id);
  }
}
