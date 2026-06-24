import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Discount extends Document {
  @Prop({ required: true, trim: true })
  name: string; // მაგ: "Summer Mega Sale"

  @Prop({ required: true, min: 1, max: 99 })
  percentage: number; // ფასდაკლების პროცენტი (მაგ: 20 ნიშნავს 20%-ს)

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  applicableProducts: Types.ObjectId[]; // პროდუქტები, რომლებზეც მოქმედებს

  @Prop({ required: true })
  startDate: Date; // აქციის დაწყების დრო

  @Prop({ required: true })
  endDate: Date; // აქციის დასრულების დრო

  @Prop({ default: true })
  isActive: boolean;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
