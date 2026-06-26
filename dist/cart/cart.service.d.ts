import { Connection, Model, Types } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { Product } from 'src/products/schema/product.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class CartService {
    private readonly cartModel;
    private readonly productModel;
    private readonly connection;
    constructor(cartModel: Model<Cart>, productModel: Model<Product>, connection: Connection);
    addItem(userId: Types.ObjectId, dto: AddToCartDto): Promise<{
        message: string;
    }>;
    getCart(userId?: string, guestId?: string): Promise<import("mongoose").FlattenMaps<Cart> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    }>;
    updateItem(userId: string, dto: UpdateCartDto): Promise<(import("mongoose").Document<unknown, {}, Cart> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    mergeCarts(userId: string, guestCartId: string): Promise<void>;
    removeItem(userId: string, productId: string): Promise<(import("mongoose").Document<unknown, {}, Cart> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    clearCart(userId: string): Promise<(import("mongoose").Document<unknown, {}, Cart> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
