import { Serialize } from '@bsadriano/rmq-nestjs-lib';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuctionService } from './auction.service';
import { AuctionDto } from './dto/auction.dto';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('api/auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

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
}
