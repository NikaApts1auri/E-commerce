import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Request } from 'express';
import { UpdateCartDto } from './dto/update-cart.dto';
interface RequestWithUser extends Request {
    user: {
        id: string;
    };
}
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(req: RequestWithUser, dto: AddToCartDto): Promise<{
        message: string;
    }>;
    getCart(req: RequestWithUser): Promise<import("mongoose").FlattenMaps<import("./schema/cart.schema").Cart> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    }>;
    removeItem(req: RequestWithUser, productId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/cart.schema").Cart> & import("./schema/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    clearCart(req: RequestWithUser): Promise<(import("mongoose").Document<unknown, {}, import("./schema/cart.schema").Cart> & import("./schema/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateItem(req: RequestWithUser, dto: UpdateCartDto): Promise<(import("mongoose").Document<unknown, {}, import("./schema/cart.schema").Cart> & import("./schema/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
export {};
