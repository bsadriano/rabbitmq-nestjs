import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { GetItemArgs } from '../dto/get-items.args';
import { CreateItemInput } from '../dto/item.inputs';
import { Item } from '../item.schema';
import { AuctionSvcHttpClientService } from './auction-svc-http-client.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    private readonly auctionSvcHttpClientService: AuctionSvcHttpClientService,
  ) {}

  async create(payload: CreateItemInput): Promise<Item> {
    return await this.itemModel.create(payload);
  }

  async getItems(args: GetItemArgs): Promise<Item[]> {
    const {
      searchTerm,
      pageSize,
      pageNumber,
      seller,
      winner,
      orderBy,
      filterBy,
    } = args;

    if (pageNumber < 0 || pageSize <= 0) {
      throw new Error('Invalid page number or page size');
    }

    let where = {};
    if (searchTerm) {
      where = {
        $text: { $search: searchTerm },
      };
    }

    let order;
    switch (orderBy) {
      case 'make':
        order = { make: 'ASC' };
        break;
      case 'new':
        order = { ['createdAt']: 'DESC' };
        break;
      default:
        order = { ['auctionEnd']: 'ASC' };
        break;
    }

    const now = new Date();
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours later

    if (filterBy) {
      switch (filterBy) {
        case 'finished':
          where = {
            ...where,
            auctionEnd: { $lt: now },
          };
          break;
        case 'endingSoon':
          where = {
            ...where,
            auctionEnd: { $lt: sixHoursLater, $gt: now },
          };
          break;
        default:
          where = {
            ...where,
            auctionEnd: { $gt: now },
          };
          break;
      }
    }

    if (!seller) {
      where = {
        ...where,
        seller,
      };
    }

    if (!winner) {
      where = {
        ...where,
        winner,
      };
    }

    const skip = (pageNumber - 1) * pageSize;

    return this.itemModel.find(where).limit(pageSize).skip(skip);
  }

  async getItem(_id: MongooseSchema.Types.ObjectId): Promise<Item> {
    return this.itemModel.findById(_id).exec();
  }
}
