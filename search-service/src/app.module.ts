import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { QueueModule } from './queue/queue.module';
import { SearchModule } from './search/search.module';
import { getMetadataArgsStorage } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const entities = getMetadataArgsStorage()
          .tables.map((tbl) => tbl.target as Function)
          .filter((entity) =>
            entity.toString().toLowerCase().includes('entity'),
          );

        return {
          type: 'mongodb',
          url: 'mongodb://localhost:27017',
          database: 'search',
          entities,
          logging: true,
          autoLoadEntities: true,
        };
      },
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/search'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      playground: {
        endpoint: 'http://localhost:7002/graphql',
      },
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    SearchModule,
    QueueModule,
  ],
  controllers: [],
})
export class AppModule {}
