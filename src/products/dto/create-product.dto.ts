import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
  Length,
  IsUppercase,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase().trim() : value,
  )
  productCode: string;
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  @Transform(({ value }) => Number(value))
  stock: number;

  @IsString()
  @IsOptional()
  description?: string;
}
