import { Field, ObjectType } from '@nestjs/graphql';
import * as Relay from 'graphql-relay';
import { PageInfo } from 'nestjs-graphql-relay';
import { Item } from '../entities/item.entity';

@ObjectType({ isAbstract: true })
export abstract class ItemsEdge implements Relay.Edge<Item> {
  @Field(() => Item)
  readonly node: Item;

  @Field()
  readonly cursor: Relay.ConnectionCursor;
}

@ObjectType()
export class ItemsConnection implements Relay.Connection<Item> {
  @Field()
  readonly pageInfo: PageInfo;

  @Field(() => [ItemsEdge])
  readonly edges: Array<Relay.Edge<Item>>;
}
