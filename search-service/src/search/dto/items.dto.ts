import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import * as Relay from 'graphql-relay';
import { PageInfo } from 'nestjs-graphql-relay';
import { Item } from '../item.model';

export function Connection<GraphQLObject>(GenericClass?: Type<GraphQLObject>) {
  @ObjectType({ isAbstract: true })
  abstract class Edge<GraphQLObject> implements Relay.Edge<GraphQLObject> {
    @Field(() => GenericClass, { nullable: false })
    node: GraphQLObject;

    @Field(() => String, { nullable: false })
    cursor: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class IConnection implements Relay.Connection<GraphQLObject> {
    @Field(() => [Edge], { nullable: false })
    edges: Array<Relay.Edge<GraphQLObject>>;

    @Field(() => PageInfo, { nullable: false })
    pageInfo: PageInfo;
  }

  return IConnection;
}
@ObjectType()
export class ItemsConnection extends Connection<Item>(Item) {}

@ObjectType()
export class BiItemsConnection {
  @Field(() => ItemsConnection, { nullable: true })
  next?: ItemsConnection;

  @Field(() => ItemsConnection, { nullable: true })
  prev?: ItemsConnection;
}
