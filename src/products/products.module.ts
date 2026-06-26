import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schema/product.schema';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { DiscountModule } from 'src/discount/discount.module';

@Module({
  imports: [
    AwsS3Module,
    DiscountModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  exports: [MongooseModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
