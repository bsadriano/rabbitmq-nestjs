import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ConnectionArgs, OrderByInput } from 'nestjs-graphql-relay';

@ArgsType()
export class ItemsConnectionArgs extends ConnectionArgs {
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

  @Field(() => OrderByInput, { nullable: true })
  @IsOptional()
  @IsString()
  readonly orderBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly filterBy?: string;
}
