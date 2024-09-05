import { Args, Query, Resolver } from '@nestjs/graphql';
import { ItemsConnectionArgs } from './dto/items-connection.args';
import { ItemsConnection } from './dto/items.dto';
import { SearchService } from './services/search.service';
import { Item } from './entities/item.entity';

@Resolver(() => Item)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => ItemsConnection)
  items(@Args() args: ItemsConnectionArgs): Promise<ItemsConnection> {
    return this.searchService.find(args);
  }

  // @Query(() => Item)
  // item(
  //   @Args('_id', { type: () => String }) _id: MongooseSchema.Types.ObjectId,
  // ) {
  //   return this.searchService.getItem(_id);
  // }

  // @Query(() => [Item])
  // // @UseGuards(JwtAuthGuard)
  // items(@Args() args: GetItemArgs) {
  //   return this.searchService.getItems(args);
  // }

  // @Mutation(() => Item)
  // createItem(@Args('payload') payload: CreateItemInput) {
  //   return this.searchService.create(payload);
  // }
}
