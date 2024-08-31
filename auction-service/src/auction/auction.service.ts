import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerService } from 'src/queue/services/producer.service';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial, IsNull, Not, Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { AuctionStatus } from './entities/auction-status.enum';
import { Auction } from './entities/auction.entity';
import { Item } from './entities/item.entity';
import { AuctionFinished } from './dto/auction-finished.dto';
import { AuctionBidPlaced } from './dto/auction-bid-placed.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private producerService: ProducerService,
  ) {}

  async create(
    {
      auctionEnd,
      color,
      imageUrl,
      make,
      mileage,
      model,
      reservePrice,
      year,
    }: CreateAuctionDto,
    seller: User,
  ) {
    const newItem = this.itemRepository.create({
      color,
      imageUrl,
      make,
      mileage,
      model,
      year,
    });

    const newAuction = this.auctionRepository.create({
      item: newItem,
      seller,
      reservePrice,
      auctionEnd,
      status: AuctionStatus.LIVE,
    });

    const savedAuction = await this.auctionRepository.save(newAuction);

    this.producerService.createAuction(savedAuction);

    return savedAuction;
  }

  async findAll(userId: number, date?: string) {
    const query = this.auctionRepository
      .createQueryBuilder('auction')
      .innerJoinAndSelect('auction.item', 'item')
      .innerJoinAndSelect('auction.seller', 'seller', 'seller.id = :id', {
        id: userId,
      })
      .orderBy('item.make', 'ASC');

    if (date) {
      query.where(
        "TO_CHAR(auction.updatedAt, 'YYYY-MM-DD HH24:MI:SS') > :date",
        {
          date,
        },
      );
    }

    return query.getMany();
  }

  async findOne(userId: number, id: number) {
    const auction = await this.auctionRepository.findOne({
      relations: ['item', 'seller'],
      where: {
        id,
        seller: {
          id: userId,
        },
      },
    });

    if (!auction) {
      throw new NotFoundException(`Auction with id #${id} not found`);
    }

    return auction;
  }

  async update(userId: number, id: number, updateAuctionDto: UpdateAuctionDto) {
    const existingAuction = await this.auctionRepository.findOne({
      relations: ['item'],
      where: {
        id,
        seller: {
          id: userId,
        },
      },
    });

    if (!existingAuction) {
      throw new NotFoundException(`Auction with id #${id} not found`);
    }

    const fieldsToUpdate = ['make', 'model', 'color', 'mileage', 'year'];

    fieldsToUpdate.forEach((field) => {
      existingAuction.item[field] =
        updateAuctionDto[field] ?? existingAuction.item[field];
    });

    await this.auctionRepository.save(existingAuction);

    this.producerService.updateAuction(id, updateAuctionDto);

    return existingAuction;
  }

  async remove(userId: number, id: number) {
    const auction = await this.findOne(userId, id);

    this.auctionRepository.remove(auction);

    this.producerService.deleteAuction(id);
  }

  async save(auctions: DeepPartial<Auction[]>) {
    return this.auctionRepository.save(auctions);
  }

  async deleteAll() {
    await this.itemRepository.delete({
      id: Not(IsNull()),
    });
  }

  async finishAuction({ id, itemSold, soldAmount, winner }: AuctionFinished) {
    const auction = await this.auctionRepository.findOneByOrFail({
      id,
    });

    if (itemSold) {
      auction.winner = winner;
      auction.soldAmount = soldAmount;
    }

    auction.status =
      auction.soldAmount > auction.reservePrice
        ? AuctionStatus.FINISHED
        : AuctionStatus.RESERVE_NOT_MET;

    return this.auctionRepository.save(auction);
  }

  async placeBid({ id, amount, bidStatus, currentHighBid }: AuctionBidPlaced) {
    var auction = await this.auctionRepository.findOneByOrFail({ id });

    if (
      auction.currentHighBid == null ||
      (bidStatus.includes('Accepted') && amount > auction.currentHighBid)
    ) {
      auction.currentHighBid = amount;
    }

    return this.auctionRepository.save(auction);
  }
}
