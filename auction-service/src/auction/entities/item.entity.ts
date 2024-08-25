import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auction } from './auction.entity';
import { Factory } from 'nestjs-seeder';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Factory((faker) => faker.vehicle.manufacturer())
  make: string;

  @Column()
  @Factory((faker) => faker.vehicle.model())
  model: string;

  @Column()
  @Factory((faker) => faker.number.int({ min: 1930, max: 2050 }))
  year: number;

  @Column()
  @Factory((faker) => faker.vehicle.color())
  color: string;

  @Column()
  @Factory((faker) => faker.number.int({ min: 1940, max: 2050 }))
  mileage: number;

  @Column()
  @Factory((faker) => faker.image.urlLoremFlickr({ category: 'transport' }))
  imageUrl: string;

  @OneToOne(() => Auction, (auction) => auction.item, { eager: false })
  auction: Auction;
}
