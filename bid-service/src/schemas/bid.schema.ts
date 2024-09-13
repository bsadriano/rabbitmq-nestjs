import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BidStatus } from './bid-status.enum';

@Schema()
export class Bid extends Document {
  @Prop()
  auctionId: number;

  @Prop({ default: null })
  bidder: string;

  @Prop()
  reservePrice: number;

  @Prop({ type: Date, default: Date.now })
  bidTime: Date;

  @Prop()
  bidStatus: BidStatus;
}

export const bidSchema = SchemaFactory.createForClass(Bid);

// itemSchema.index({ make: 'text', carModel: 'text', color: 'text' });
