import {
  CurrentUser,
  JwtAuthGuard,
  RmqService,
  Serialize,
} from '@bsadriano/rmq-nestjs-lib';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { User } from 'src/users/entities/user.entity';
import { AuctionService } from './auction.service';
import {
  AuctionBidPlacedDto,
  AuctionFinishedDto,
} from '@bsadriano/rmq-nestjs-lib';
import { AuctionDto } from './dto/auction.dto';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Controller('api/auctions')
export class AuctionController {
  private logger = new Logger('AuctionController');

  constructor(
    private readonly auctionService: AuctionService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  @Serialize(AuctionDto)
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: User,
    @Body() createAuctionDto: CreateAuctionDto,
  ) {
    return this.auctionService.create(createAuctionDto, user);
  }

  @Get('seed')
  @Serialize(AuctionDto)
  getSeedData(@Query('date') date?: string) {
    return this.auctionService.findAll(null, date);
  }

  @Get()
  @Serialize(AuctionDto)
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User, @Query('date') date?: string) {
    return this.auctionService.findAll(user.id, date);
  }

  @Get(':id')
  @Serialize(AuctionDto)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.auctionService.findOne(+id);
  }

  @Patch(':id')
  @Serialize(AuctionDto)
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ) {
    return this.auctionService.update(user.id, +id, updateAuctionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.auctionService.remove(+id);
  }

  @EventPattern('auction-finished')
  async handleAuctionFinished(
    @Payload() auctionFinished: AuctionFinishedDto,
    @Ctx() context: RmqContext,
  ) {
    this.logger.verbose('Consuming auction finished');

    await this.auctionService.finishAuction(auctionFinished);

    this.rmqService.ack(context);
  }

  @EventPattern('auction-bid-placed')
  async handleBidPlaced(
    @Payload() auctionBidPlaced: AuctionBidPlacedDto,
    @Ctx() context: RmqContext,
  ) {
    this.logger.verbose('Consuming bid placed');

    await this.auctionService.placeBid(auctionBidPlaced);

    this.rmqService.ack(context);
  }
}
