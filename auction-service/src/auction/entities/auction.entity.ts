import { Factory } from 'nestjs-seeder';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuctionStatus } from './auction-status.enum';
import { Item } from './item.entity';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Factory((faker) =>
    faker.commerce.price({ dec: 0, min: 10000_00, max: 1000000_00 }),
  )
  reservePrice: number = 0;

  @Column()
  @Factory((faker) => faker.person.fullName())
  seller: string;

  @Column({ nullable: true })
  @Factory((faker) => faker.person.fullName())
  winner: string;

  @Column({ nullable: true })
  @Factory((faker) =>
    faker.commerce.price({ dec: 0, min: 10000_00, max: 1000000_00 }),
  )
  soldAmount: number;

  @Column({ nullable: true })
  @Factory((faker) =>
    faker.commerce.price({ dec: 0, min: 10000_00, max: 1000000_00 }),
  )
  currentHighBid: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Factory((faker) => faker.date.recent())
  createdAt: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Factory((faker) => faker.date.recent())
  updatedAt: string;

  @Column({
    type: 'timestamptz',
  })
  @Factory((faker) => faker.date.recent())
  auctionEnd: string;

  @Column()
  @Factory((faker) => faker.helpers.enumValue(AuctionStatus))
  status: AuctionStatus;

  @JoinColumn()
  @OneToOne(() => Item, (item) => item.auction, { eager: true, cascade: true })
  item: Item;
}
