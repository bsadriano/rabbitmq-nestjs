import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import { ConnectionArgs, findAndPaginate } from 'nestjs-graphql-relay';
import { AuctionUpdated } from 'src/queue/dto/auction-updated';
import { FindManyOptions, Repository } from 'typeorm';
import { AuctionBidPlaced } from '../dto/auction-bid-placed.dto';
import { AuctionFinished } from '../dto/auction-finished.dto';
import { CreateItemInput } from '../dto/item.inputs';
// import { Item } from '../item.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entities/item.entity';
import { ItemsConnectionArgs } from '../dto/items-connection.args';

// type PagedResult<T> = {
//   results: T[];
//   pageCount: number;
//   totalCount: number;
// };

@Injectable()
export class SearchService {
  constructor(
    // private readonly auctionSvcHttpClientService: AuctionSvcHttpClientService,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async create(payload: CreateItemInput) {
    //   return await this.itemModel.create(payload);
  }

  async getCount() {
    //   return await this.itemModel.countDocuments();
  }

  async find(connArgs: ItemsConnectionArgs) {
    // const { searchTerm, seller, winner, orderBy, filterBy } = connArgs;

    // let where = {};
    // if (searchTerm) {
    //   where = {
    //     $text: { $search: searchTerm },
    //   };
    // }

    // let order;
    // switch (orderBy) {
    //   case 'make':
    //     order = { make: 'ASC' };
    //     break;
    //   case 'new':
    //     order = { createdAt: 'DESC' };
    //     break;
    //   default:
    //     order = { auctionEnd: 'DESC' };
    //     break;
    // }

    // const now = new Date();
    // const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours later

    // if (filterBy) {
    //   switch (filterBy) {
    //     case 'finished':
    //       where = {
    //         ...where,
    //         auctionEnd: { $lt: now },
    //       };
    //       break;
    //     case 'endingSoon':
    //       where = {
    //         ...where,
    //         auctionEnd: { $lt: sixHoursLater, $gt: now },
    //       };
    //       break;
    //     default:
    //       where = {
    //         ...where,
    //         auctionEnd: { $gt: now },
    //       };
    //       break;
    //   }
    // }

    // if (seller) {
    //   where = {
    //     ...where,
    //     seller,
    //   };
    // }

    // if (winner) {
    //   where = {
    //     ...where,
    //     winner,
    //   };
    // }

    console.log(await findAndPaginate({}, connArgs, this.itemRepository));

    return findAndPaginate({}, connArgs, this.itemRepository);
  }

  // async getItems(args: GetItemArgs): Promise<Item[]> {
  //   const {
  //     searchTerm,
  //     pageSize,
  //     pageNumber,
  //     seller,
  //     winner,
  //     orderBy,
  //     filterBy,
  //   } = args;

  //   if (pageNumber < 0 || pageSize <= 0) {
  //     throw new Error('Invalid page number or page size');
  //   }

  //   let where = {};
  //   if (searchTerm) {
  //     where = {
  //       $text: { $search: searchTerm },
  //     };
  //   }

  //   let order;
  //   switch (orderBy) {
  //     case 'make':
  //       order = ['make', 1];
  //       break;
  //     case 'new':
  //       order = ['createdAt', -1];
  //       break;
  //     default:
  //       order = ['auctionEnd', -1];
  //       break;
  //   }

  //   const now = new Date();
  //   const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours later

  //   if (filterBy) {
  //     switch (filterBy) {
  //       case 'finished':
  //         where = {
  //           ...where,
  //           auctionEnd: { $lt: now },
  //         };
  //         break;
  //       case 'endingSoon':
  //         where = {
  //           ...where,
  //           auctionEnd: { $lt: sixHoursLater, $gt: now },
  //         };
  //         break;
  //       default:
  //         where = {
  //           ...where,
  //           auctionEnd: { $gt: now },
  //         };
  //         break;
  //     }
  //   }

  //   if (seller) {
  //     where = {
  //       ...where,
  //       seller,
  //     };
  //   }

  //   if (winner) {
  //     where = {
  //       ...where,
  //       winner,
  //     };
  //   }

  //   const skip = (pageNumber - 1) * pageSize;

  //   // return this.itemModel.find();
  //   console.log(args, where);

  //   // const totalCount = await this.itemModel.countDocuments();
  //   // const pageCount = Math.ceil(totalCount / pageSize);
  //   // return {
  //   //   results,
  //   //   pageCount,
  //   //   totalCount,
  //   // };

  //   return this.itemModel.find(where).sort([order]).limit(pageSize).skip(skip);
  // }

  // async getItem(_id: MongooseSchema.Types.ObjectId): Promise<Item> {
  //   return this.itemModel.findById(_id).exec();
  // }

  async update(data: AuctionUpdated) {
    //   return await this.itemModel.findOneAndUpdate({ id: data.id }, data, {
    //     new: true,
    //   });
  }

  async deleteById(id: number) {
    //   return await this.itemModel.findOneAndDelete({ id });
  }

  async finishAuction({ id, itemSold, soldAmount, winner }: AuctionFinished) {
    //   const auction = await this.itemModel.findById({
    //     id,
    //   });
    //   if (!auction) {
    //     throw new NotFoundException(`Auction with id #${id} not found`);
    //   }
    //   const update: any = {};
    //   if (itemSold) {
    //     update.winner = winner;
    //     update.soldAmount = soldAmount;
    //   }
    //   update.status = 'Finished';
    //   await this.itemModel.updateOne({ id }, update);
  }

  async placeBid({ id, amount, bidStatus, currentHighBid }: AuctionBidPlaced) {
    //   const auction = await this.itemModel.findById({
    //     id,
    //   });
    //   if (!auction) {
    //     throw new NotFoundException(`Auction with id #${id} not found`);
    //   }
    //   const update: any = {};
    //   if (
    //     auction.currentHighBid == null ||
    //     (bidStatus.includes('Accepted') && amount > auction.currentHighBid)
    //   ) {
    //     update.currentHighBid = amount;
    //   }
    //   update.status = 'Finished';
    //   await this.itemModel.updateOne({ id }, update);
  }
}
