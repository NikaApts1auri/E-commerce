import { IsNumber, IsArray, IsMongoId } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  totalAmount: number;

  @IsArray()
  items: any[];

  @IsMongoId()
  userId: string;
}
