import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

@ArgsType()
export class GetItemArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @Field((type) => Int, { defaultValue: 1 }) // Specify type for integer
  @IsInt()
  @Min(1)
  pageSize: number;

  @Field((type) => Int, { defaultValue: 1 }) // Specify type for integer
  @IsInt()
  @Min(1)
  pageNumber: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  seller?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  winner?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  filterBy?: string;
}
