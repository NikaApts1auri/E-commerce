import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
    create(createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product> & import("./schema/product.schema").Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
