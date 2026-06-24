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
  @IsNumber()
  @Min(1, { message: 'ფასდაკლება უნდა იყოს მინიმუმ 1%' })
  @Max(100, { message: 'ფასდაკლება არ შეიძლება იყოს 100%-ზე მეტი' })
  percentage: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'პროდუქტის სახელი არ უნდა იყოს ცარიელი' })
  @Transform(({ value }) => value?.trim()) // აშორებს ზედმეტ სფეისებს წინ და უკან
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'პროდუქტის კოდი არ უნდა იყოს ცარიელი' })
  @Transform(({ value }) => value?.trim())
  productCode?: string;
}
