import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { CreateItemInput } from './dto/item.inputs';
import { GetItemArgs } from './dto/get-items.args';
import { SearchService } from './services/search.service';
import { Item } from './item.model';

@Resolver(() => Item)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}
  @Query(() => Item)
  item(
    @Args('_id', { type: () => String }) _id: MongooseSchema.Types.ObjectId,
  ) {
    return this.searchService.getItem(_id);
  }

  @Query(() => [Item])
  items(@Args() args: GetItemArgs) {
    return this.searchService.getItems(args);
  }

  @Mutation(() => Item)
  createItem(@Args('payload') payload: CreateItemInput) {
    return this.searchService.create(payload);
  }
}
