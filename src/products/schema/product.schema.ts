import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIn } from 'class-validator';
import mongoose, { Document } from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    transform: function (_doc, ret) {
      const { _id, __v, ...rest } = ret;
      return rest;
    },
  },
})
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  productCode: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: String, required: true })
  category: string;

  originalPrice?: number;
  currentPrice?: number;
  discountPercentage?: number;
  isOnSale?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text', productCode: 'text' });
