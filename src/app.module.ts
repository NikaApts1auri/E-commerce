import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { EmailSenderModule } from './email-sender/email-sender.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { DiscountModule } from './discount/discount.module';
import { CartModule } from './cart/cart.module';
import { GuestMiddleware } from './Middleware/guest-Middleware';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL!),

    UsersModule,
    AuthModule,
    AwsS3Module,
    EmailSenderModule,
    ProductsModule,
    DiscountModule,
    CartModule,
    PaymentModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GuestMiddleware).forRoutes('*');
  }
}
