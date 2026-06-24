import mongoose, { Document } from 'mongoose';
export declare class Product extends Document {
    name: string;
    productCode: string;
    price: number;
    stock: number;
    description: string;
    image: string;
    isDeleted: boolean;
    category: string;
    originalPrice?: number;
    currentPrice?: number;
    discountPercentage?: number;
    isOnSale?: boolean;
}
export declare const ProductSchema: mongoose.Schema<Product, mongoose.Model<Product, any, any, any, mongoose.Document<unknown, any, Product> & Product & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Product, mongoose.Document<unknown, {}, mongoose.FlatRecord<Product>> & mongoose.FlatRecord<Product> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
