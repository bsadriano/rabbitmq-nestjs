import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Connection, DeepPartial, IsNull, Not, Repository } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionStatus } from './entities/auction-status.enum';
import { Item } from './entities/item.entity';
import { ProducerService } from 'src/queue/services/producer.service';
import { AuctionCreated } from 'src/queue/contracts/auction-created';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private producerService: ProducerService,
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

    const savedAuction = await this.auctionRepository.save(newAuction);

    this.producerService.createAuction(savedAuction);

    return savedAuction;
  }

  async findAll(date?: string) {
    const query = this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.item', 'item')
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

    this.producerService.updateAuction(id, updateAuctionDto);

    return existingAuction;
  }

  async remove(id: number) {
    try {
      const auction = await this.findOne(id);

      this.auctionRepository.remove(auction);

      this.producerService.deleteAuction(id);
    } catch (err) {}
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
