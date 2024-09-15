import { CurrentUser, Serialize, User } from '@bsadriano/rmq-nestjs-lib';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BidDto } from './dto/bid.dto';
import { PlaceBidRequestDto } from './dto/place-bid-request.dto';
import { BidService } from './services/bid.service';

@Controller('api/bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  placeBid(
    @CurrentUser() user: User,
    @Body() placeBidRequestDto: PlaceBidRequestDto,
  ) {
    return this.bidService.placeBid(user, placeBidRequestDto);
  }

  @Get(':id')
  @Serialize(BidDto)
  @UseGuards(JwtAuthGuard)
  getBidsForAuction(@Body('auctionId') auctionId: number) {
    return this.bidService.getBidsForAuction(auctionId);
  }
}
