import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Auction extends Document {
  @Prop({ type: Date })
  auctionEnd: Date;

  @Prop()
  seller: string;

  @Prop()
  reservePrice: number;

  @Prop()
  finished: boolean;
}

export const auctionSchema = SchemaFactory.createForClass(Auction);

// itemSchema.index({ make: 'text', carModel: 'text', color: 'text' });
