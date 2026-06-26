import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { DiscountService } from '../discount';
export declare class ProductsService {
    private readonly productModel;
    private readonly awsS3Service;
    private readonly discountService;
    constructor(productModel: Model<Product>, awsS3Service: AwsS3Service, discountService: DiscountService);
    private applyDiscountToProduct;
    private applyDiscounts;
    findAll(search?: string, page?: number, limit?: number): Promise<{
        products: any;
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    private generateUniqueProductCode;
    create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, Product> & Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
