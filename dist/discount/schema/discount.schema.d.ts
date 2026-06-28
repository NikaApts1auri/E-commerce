import { Document, Types } from 'mongoose';
export declare class Discount extends Document {
    name: string;
    percentage: number;
    applicableProducts: Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}
export declare const DiscountSchema: import("mongoose").Schema<Discount, import("mongoose").Model<Discount, any, any, any, Document<unknown, any, Discount, any, {}> & Discount & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Discount, Document<unknown, {}, import("mongoose").FlatRecord<Discount>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Discount> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
