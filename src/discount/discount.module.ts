import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';

import { Product, ProductSchema } from '../products/schema/product.schema';
import { Discount, DiscountSchema } from './schema/discount.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
