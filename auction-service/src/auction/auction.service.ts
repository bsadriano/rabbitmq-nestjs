import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { DeepPartial, IsNull, Not, Repository } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionStatus } from './entities/auction-status.enum';
import { Item } from './entities/item.entity';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async create({
    auctionEnd,
    color,
    imageUrl,
    make,
    mileage,
    model,
    reservePrice,
    year,
  }: CreateAuctionDto) {
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
      seller: 'test',
      reservePrice,
      auctionEnd,
      status: AuctionStatus.LIVE,
    });
    return this.auctionRepository.save(newAuction);
  }

  async findAll() {
    return this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.item', 'item')
      .orderBy('item.make', 'ASC')
      .getMany();
  }

  async findOne(id: number) {
    const auction = await this.auctionRepository.findOne({
      relations: ['item'],
      where: {
        id,
      },
    });

    if (!auction) {
      throw new NotFoundException(`Auction with id #${id} not found`);
    }

    return auction;
  }

  async update(id: number, updateAuctionDto: UpdateAuctionDto) {
    const existingAuction = await this.auctionRepository.findOne({
      relations: ['item'],
      where: {
        id,
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

    return existingAuction;
  }

  async remove(id: number) {
    const auction = await this.findOne(id);
    this.auctionRepository.remove(auction);
  }

  async save(auctions: DeepPartial<Auction[]>) {
    return this.auctionRepository.save(auctions);
  }

  async deleteAll() {
    this.auctionRepository.delete({
      id: Not(IsNull()),
    });
  }
}
