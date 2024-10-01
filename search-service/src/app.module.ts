import { HealthModule } from '@bsadriano/rmq-nestjs-lib';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { QueueModule } from './queue/queue.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('mongodb.uri'),
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        playground: {
          endpoint: configService.get<string>('graphql.endpoint'),
        },
        autoSchemaFile: true,
        context: ({ req, res }) => ({ req, res }),
      }),
      inject: [ConfigService],
    }),
    SearchModule,
    QueueModule,
    HealthModule,
  ],
  controllers: [],
})
export class AppModule {}
