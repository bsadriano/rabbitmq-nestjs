import {
  CurrentUser,
  JwtAuthGuard,
  Serialize,
  User,
} from '@bsadriano/rmq-nestjs-lib';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BidDto } from './dto/bid.dto';
import { PlaceBidRequestDto } from './dto/place-bid-request.dto';
import { BidService } from './services/bid.service';

@Controller()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post('place-bid')
  @UseGuards(JwtAuthGuard)
  placeBid(
    @CurrentUser() user: User,
    @Body() placeBidRequestDto: PlaceBidRequestDto,
  ) {
    return this.bidService.placeBid(user, placeBidRequestDto);
  }

  @Get(':auctionId')
  @Serialize(BidDto)
  @UseGuards(JwtAuthGuard)
  getBidsForAuction(@Param('auctionId') auctionId: number) {
    return this.bidService.getBidsForAuction(auctionId);
  }
}
