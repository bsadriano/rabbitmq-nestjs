import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Item extends Document {
  @Prop()
  id: number;

  @Prop()
  reservePrice: number;

  @Prop()
  seller: string;

  @Prop()
  winner: string;

  @Prop()
  soldAmount: number;

  @Prop()
  currentHighBid: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  auctionEnd: Date;

  @Prop()
  make: string;

  @Prop()
  year: number;

  @Prop()
  carModel: string;

  @Prop()
  color: string;

  @Prop()
  mileage: number;

  @Prop()
  imageUrl: string;
}

export const itemSchema = SchemaFactory.createForClass(Item);

itemSchema.index({ make: 'text', carModel: 'text', color: 'text' });
