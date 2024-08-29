import { Factory } from 'nestjs-seeder';
import { Auction } from 'src/auction/entities/auction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Factory((faker) => faker.internet.email())
  email: string;

  @Column()
  @Factory((faker) => faker.internet.userName())
  username: string;

  @Column()
  @Factory((faker) => faker.person.firstName())
  firstName: string;

  @Column()
  @Factory((faker) => faker.person.lastName())
  lastName: string;

  @Column()
  @Factory((faker) => faker.internet.password())
  password: string;

  @OneToMany(() => Auction, (auction) => auction.seller)
  auctions: Auction[];
}
