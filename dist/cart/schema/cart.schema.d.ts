import { Document, Types } from 'mongoose';
export declare class Cart extends Document {
    userId: Types.ObjectId;
    guestId?: string;
    items: {
        productId: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    createdAt: Date;
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, Document<unknown, any, Cart> & Cart & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, import("mongoose").FlatRecord<Cart>> & import("mongoose").FlatRecord<Cart> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
