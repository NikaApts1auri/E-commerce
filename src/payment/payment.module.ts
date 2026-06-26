import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from 'src/order/order.module';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [OrderModule],
})
export class PaymentModule {}
