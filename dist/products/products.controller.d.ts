import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly awsS3Service;
    constructor(productsService: ProductsService, awsS3Service: AwsS3Service);
    findAll(search?: string, page?: string, limit?: string): Promise<{
        products: (import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product> & import("./schema/product.schema").Product & Required<{
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
    createProduct(createProductDto: CreateProductDto, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product> & import("./schema/product.schema").Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
