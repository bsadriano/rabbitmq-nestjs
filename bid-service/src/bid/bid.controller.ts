import { JwtAuthGuard, Serialize } from '@bsadriano/rmq-nestjs-lib';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidDto } from './dto/bid.dto';

@Controller('api/bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  placeBid(
    @Body('auctionId') auctionId: number,
    @Body('amount') amount: number,
  ) {
    this.bidService.placeBid(auctionId, amount);
  }

  @Get(':id')
  @Serialize(BidDto)
  @UseGuards(JwtAuthGuard)
  getBidsForAuction(@Body('auctionId') auctionId: number) {
    return this.bidService.getBidsForAuction(auctionId);
  }
}
