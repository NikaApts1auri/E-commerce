export declare class ProductsController {
    findAll(): {
        id: number;
        name: string;
        price: number;
    }[];
    create(): {
        success: boolean;
        message: string;
    };
}
