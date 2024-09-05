import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class Node {
  @Field(() => ID, { name: '_id' })
  readonly relayId: string;
}
