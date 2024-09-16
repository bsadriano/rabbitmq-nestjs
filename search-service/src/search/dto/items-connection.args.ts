import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import * as Relay from 'graphql-relay';

@ArgsType()
export class ItemsConnectionArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly before?: Relay.ConnectionCursor | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly after?: Relay.ConnectionCursor | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  readonly first?: number | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  readonly last?: number | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly searchTerm?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly seller?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly winner?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly orderBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly filterBy?: string;

  @Field()
  @IsBoolean()
  readonly next: boolean;

  @Field()
  @IsBoolean()
  readonly prev: boolean;
}
