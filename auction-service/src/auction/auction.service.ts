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

  async findAll(userId?: number, date?: string) {
    const query = this.auctionRepository
      .createQueryBuilder('auction')
      .innerJoinAndSelect('auction.item', 'item')
      .orderBy('item.make', 'ASC');

    if (userId) {
      query.innerJoinAndSelect('auction.seller', 'seller', 'seller.id = :id', {
        id: userId,
      });
    } else {
      query.leftJoinAndSelect('auction.seller', 'seller');
    }

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
      relations: ['item', 'seller'],
      where: {
        id,
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

  async remove(id: number) {
    const auction = await this.findOne(id);

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
}
