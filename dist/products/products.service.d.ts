import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
export declare class ProductsService {
    private readonly productModel;
    private readonly awsS3Service;
    constructor(productModel: Model<Product>, awsS3Service: AwsS3Service);
    findAll(search?: string, page?: number, limit?: number): Promise<{
        products: (import("mongoose").Document<unknown, {}, Product> & Product & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    private generateUniqueProductCode;
    create(createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, Product> & Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createWithImage(createProductDto: CreateProductDto, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, Product> & Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
