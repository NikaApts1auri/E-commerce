import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Array, required: true })
  items: any[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'pending' }) // pending, paid, cancelled
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
