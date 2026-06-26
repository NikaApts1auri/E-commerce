import { Document, Types } from 'mongoose';
export interface CartItem {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}
export interface Cart extends Document {
    userId: Types.ObjectId;
    items: CartItem[];
    totalAmount: number;
}
