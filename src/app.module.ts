import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './modules/category/category.module';
import { loggerMiddleware } from './common/middleware/logger.middleware';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import { TestModule } from './modules/test/test.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
// import { OrderResolver } from './module/order/order.resolver';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: function (configService: ConfigService) {
        console.log(configService.get('MONGO_URI'));
        return { uri: configService.get('MONGO_URI') };
      },
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: `${configService.get('HOST')}`,
            auth: {
              user: configService.get('EMAIL'),
              pass: configService.get('PASS'),
            },
            tls: {
              rejectUnauthorized: false, // هنا السحر بيحصل
            },
          },
        };
      },
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/modules/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory(),
              ttl: 15000,
            }),
            createKeyv(configService.get('REDIS_LOCAL')),
          ],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),

    UserModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // providers: [AppService, OrderResolver],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes('*');
  }
}
// stores:[
//   new Keyv({
//     store:new CacheableMemory()
//   })
//   createKeyv(configService.get("REDIS_LOCAL"))
// ]
