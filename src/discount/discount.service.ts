import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Product } from '../products/schema/product.schema';
import { Discount } from './schema/discount.schema';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private readonly discountModel: Model<Discount>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const { percentage, name, productCode } = createDiscountDto;

    if (!name && !productCode) {
      throw new BadRequestException('გთხოვთ მიუთითოთ პროდუქტის სახელი ან კოდი');
    }

    const searchCondition = name ? { name } : { productCode };
    const foundProduct = await this.productModel
      .findOne({ isDeleted: { $ne: true }, ...searchCondition })
      .exec();

    if (!foundProduct) {
      throw new BadRequestException('მითითებული პროდუქტი ვერ მოიძებნა');
    }

    const productIdStr = (foundProduct._id as any).toString();

    const existingActiveDiscount =
      await this.getActiveDiscountForProduct(productIdStr);
    if (existingActiveDiscount) {
      throw new BadRequestException(
        'ამ პროდუქტზე უკვე არსებობს აქტიური ფასდაკლება!',
      );
    }

    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const newDiscount = new this.discountModel({
      name: `Sale for ${foundProduct.name}`,
      percentage,
      applicableProducts: [foundProduct._id as any],
      startDate: now,
      endDate: oneMonthLater,
      isActive: true,
    });

    return newDiscount.save();
  }

  async findAll(onlyActive?: boolean): Promise<Discount[]> {
    let query = {};

    if (onlyActive) {
      const now = new Date();
      query = {
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      };
    }

    return this.discountModel
      .find(query)
      .populate({
        path: 'applicableProducts',
        model: 'Product',
        select: 'name productCode price image description stock',
      })
      .exec();
  }

  async getActiveDiscountForProduct(
    productId: string,
  ): Promise<Discount | null> {
    const now = new Date();
    return this.discountModel
      .findOne({
        applicableProducts: productId,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .exec();
  }
}
