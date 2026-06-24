import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
  Length,
  IsUppercase,
  IsIn,
} from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @Exclude()
  productCode?: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  stock: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'phone',
    'tab',
    'laptop',
    'accessory',
    'audio',
    'smartwatch',
    'camera',
    'gaming',
    'other',
  ])
  category: string;
}
