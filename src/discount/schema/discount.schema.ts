import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, strict: true })
export class Discount extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true }) //
  saleName: string;

  @Prop({ required: true, min: 1, max: 99 })
  percentage: number; // ფასდაკლების პროცენტი (მაგ: 20 ნიშნავს 20%-ს)

  @Prop({ type: Object })
  priceDetails: { oldPrice: number; newPrice: number };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  applicableProducts: Types.ObjectId[]; // პროდუქტები, რომლებზეც მოქმედებს

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
