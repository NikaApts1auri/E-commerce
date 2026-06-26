import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryParams {
  @ApiPropertyOptional({
    example: 1,
    description: 'გვერდის ნომერი',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number = 1;

  @ApiPropertyOptional({
    example: 30,
    description: 'ერთ გვერდზე გამოსაჩენი ელემენტების რაოდენობა',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take: number = 30;
}
