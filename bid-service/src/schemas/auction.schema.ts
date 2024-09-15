import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Auction extends Document {
  @Prop()
  id: number;

  @Prop({ type: Date })
  auctionEnd: Date;

  @Prop()
  seller: string;

  @Prop()
  reservePrice: number;

  @Prop()
  finished: boolean;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const auctionSchema = SchemaFactory.createForClass(Auction);

// itemSchema.index({ make: 'text', carModel: 'text', color: 'text' });
