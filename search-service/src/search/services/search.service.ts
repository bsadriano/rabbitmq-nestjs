import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as Relay from 'graphql-relay';
import { Model } from 'mongoose';
import { getPagingParameters } from 'nestjs-graphql-relay';
import { AuctionUpdated } from 'src/queue/dto/auction-updated';
import { AuctionBidPlaced } from '../dto/auction-bid-placed.dto';
import { AuctionFinished } from '../dto/auction-finished.dto';
import { CreateItemInput } from '../dto/item.inputs';
import { ItemsConnectionArgs } from '../dto/items-connection.args';
import { BiItemsConnection } from '../dto/items.dto';
import { Item } from '../item.model';
import { AuctionSvcHttpClientService } from './auction-svc-http-client.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    private readonly auctionSvcHttpClientService: AuctionSvcHttpClientService,
  ) {}

  async create(payload: CreateItemInput) {
    return await this.itemModel.create(payload);
  }

  async getCount() {
    return await this.itemModel.countDocuments();
  }

  async findBi(connArgs: ItemsConnectionArgs) {
    const { next, prev } = connArgs;
    const items: BiItemsConnection = {};

    if (next) {
      items.next = await this.findNext(connArgs);
    }
    if (prev) {
      items.prev = await this.findPrevious(connArgs);
    }

    return items;
  }

  async findNext(connArgs: ItemsConnectionArgs) {
    const { after, first } = connArgs;

    if (after && first < 0) {
      throw new Error('Invalid page number or page size');
    }

    const args = {
      ...connArgs,
      before: null,
      last: null,
    };

    return this.find(args);
  }

  async findPrevious(connArgs: ItemsConnectionArgs) {
    const { before, last } = connArgs;

    if (before && last < 0) {
      throw new Error('Invalid page number or page size');
    }

    const args = {
      ...connArgs,
      after: null,
      first: null,
    };

    return this.find(args);
  }

  async find(connArgs: ItemsConnectionArgs) {
    const { where, order } = this.getFilters(connArgs);

    const { limit, offset } = getPagingParameters(connArgs);

    const items = await this.itemModel
      .find(where)
      .sort([order])
      .limit(limit)
      .skip(offset);

    const count = await this.itemModel.countDocuments();

    return Relay.connectionFromArraySlice(items, connArgs, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
  }

  getFilters(connArgs: ItemsConnectionArgs) {
    const { searchTerm, seller, winner, orderBy, filterBy } = connArgs;

    let where = {};
    if (searchTerm) {
      where = {
        $text: { $search: searchTerm },
      };
    }

    let order;
    switch (orderBy) {
      case 'make':
        order = ['make', 1];
        break;
      case 'new':
        order = ['createdAt', -1];
        break;
      default:
        order = ['auctionEnd', -1];
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

    if (seller) {
      where = {
        ...where,
        seller,
      };
    }

    if (winner) {
      where = {
        ...where,
        winner,
      };
    }

    return {
      where,
      order,
    };
  }

  async update(data: AuctionUpdated) {
    return await this.itemModel.findOneAndUpdate({ id: data.id }, data, {
      new: true,
    });
  }

  async deleteById(id: number) {
    return await this.itemModel.findOneAndDelete({ id });
  }

  async finishAuction({ id, itemSold, soldAmount, winner }: AuctionFinished) {
    const auction = await this.itemModel.findById({
      id,
    });
    if (!auction) {
      throw new NotFoundException(`Auction with id #${id} not found`);
    }
    const update: any = {};
    if (itemSold) {
      update.winner = winner;
      update.soldAmount = soldAmount;
    }
    update.status = 'Finished';
    await this.itemModel.updateOne({ id }, update);
  }

  async placeBid({ id, amount, bidStatus, currentHighBid }: AuctionBidPlaced) {
    const auction = await this.itemModel.findById({
      id,
    });
    if (!auction) {
      throw new NotFoundException(`Auction with id #${id} not found`);
    }
    const update: any = {};
    if (
      auction.currentHighBid == null ||
      (bidStatus.includes('Accepted') && amount > auction.currentHighBid)
    ) {
      update.currentHighBid = amount;
    }
    update.status = 'Finished';
    await this.itemModel.updateOne({ id }, update);
  }
}
