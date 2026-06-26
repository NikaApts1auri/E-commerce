import { Model } from 'mongoose';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Product } from '../products/schema/product.schema';
import { Discount } from './schema/discount.schema';
export declare class DiscountService {
    private readonly discountModel;
    private readonly productModel;
    constructor(discountModel: Model<Discount>, productModel: Model<Product>);
    create(createDiscountDto: CreateDiscountDto): Promise<Discount>;
    findAll(onlyActive?: boolean): Promise<Discount[]>;
    getActiveDiscountForProduct(productId: string): Promise<Discount | null>;
}
