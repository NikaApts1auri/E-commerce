import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, index: true, required: false })
  guestId?: string;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: { productId: Types.ObjectId; quantity: number; price: number }[];

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ type: Date, expires: '30d', default: Date.now })
  createdAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
