import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    example: '64f1b2b3c4d5e6f7a8b9c0d1',
    description: 'პროდუქტის ID, რომლის რაოდენობაც უნდა შეიცვალოს',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'ახალი რაოდენობა (მინიმუმ 1)',
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
