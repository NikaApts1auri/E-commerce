import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDiscountDto {
  @ApiProperty({
    example: 15,
    description: 'ფასდაკლების პროცენტი (1-დან 100-მდე)',
  })
  @IsNumber()
  @Min(1, { message: 'ფასდაკლება უნდა იყოს მინიმუმ 1%' })
  @Max(100, { message: 'ფასდაკლება არ შეიძლება იყოს 100%-ზე მეტი' })
  percentage: number;

  @ApiPropertyOptional({
    example: 'Summer Sale',
    description: 'ფასდაკლების სახელი (ოპციონალური)',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'პროდუქტის სახელი არ უნდა იყოს ცარიელი' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiPropertyOptional({
    example: 'SUMMER2026',
    description: 'პროდუქტის კოდი ფასდაკლებისთვის (ოპციონალური)',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'პროდუქტის კოდი არ უნდა იყოს ცარიელი' })
  @Transform(({ value }) => value?.trim())
  productCode?: string;
}
