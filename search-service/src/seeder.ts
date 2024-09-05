import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { getMetadataArgsStorage } from 'typeorm';
import configuration from './config/configuration';
import { SearchModule } from './search/search.module';
import { SearchSeeder } from './search/search.seeder';
import { Item } from './search/entities/item.entity';
import { join } from 'path';

console.log(join(__dirname, '/**/*.entity.[t|j]s'));

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const entities = getMetadataArgsStorage()
          .tables.map((tbl) => tbl.target as Function)
          .filter((entity) =>
            entity.toString().toLowerCase().includes('entity'),
          );

        return {
          type: 'mongodb',
          url: configService.get<string>('mongodb.connection_string'),
          database: configService.get<string>('mongodb.db'),
          entities,
          logging: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Item]),
    SearchModule,
  ],
}).run([SearchSeeder]);
