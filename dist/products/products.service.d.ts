import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private readonly productModel;
    constructor(productModel: Model<Product>);
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
    create(createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, Product> & Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
