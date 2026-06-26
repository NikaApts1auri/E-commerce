import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsArray,
  IsMongoId,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ცალკე კლასი შეკვეთის თითოეული ნივთისთვის
export class OrderItemDto {
  @ApiProperty({ example: '64f1b2b3c4d5e6f7a8b9c0d1' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 150.5, description: 'შეკვეთის საერთო ღირებულება' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ type: [OrderItemDto], description: 'შეკვეთილი ნივთების სია' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: '64f1b2b3c4d5e6f7a8b9c0d1' })
  @IsMongoId()
  userId: string;
}
