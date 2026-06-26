import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: '64f1b2b3c4d5e6f7a8b9c0d1',
    description: 'პროდუქტის უნიკალური MongoDB ID',
  })
  @IsMongoId()
  productId: string;

  @ApiProperty({
    example: 1,
    description: 'პროდუქტის რაოდენობა (უნდა იყოს მინიმუმ 1)',
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
