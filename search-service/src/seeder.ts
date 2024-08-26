import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';
import configuration from './config/configuration';
import { Item, itemSchema } from './search/item.schema';
import { SearchModule } from './search/search.module';
import { SearchSeeder } from './search/search.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/search'),
    MongooseModule.forFeature([{ name: Item.name, schema: itemSchema }]),
    SearchModule,
  ],
}).run([SearchSeeder]);
