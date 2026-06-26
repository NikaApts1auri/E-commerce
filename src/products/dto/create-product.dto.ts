import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
  Length,
  IsIn,
} from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'პროდუქტის დასახელება',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  // @Exclude() ნიშნავს რომ ეს ველი არ უნდა გამოჩნდეს API-ს პასუხში ან მოთხოვნაში
  // ამიტომ Swagger-ში მის დასამატებლად Property-ს არ ვწერთ.
  @Exclude()
  productCode?: string;

  @ApiProperty({ example: 2999.99, description: 'პროდუქტის ფასი' })
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 50, description: 'მარაგში არსებული რაოდენობა' })
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  stock: number;

  @ApiPropertyOptional({
    example: 'ახალი თაობის სმარტფონი',
    description: 'პროდუქტის აღწერა',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: [
      'phone',
      'tab',
      'laptop',
      'accessory',
      'audio',
      'smartwatch',
      'camera',
      'gaming',
      'other',
    ],
    description: 'პროდუქტის კატეგორია',
  })
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
