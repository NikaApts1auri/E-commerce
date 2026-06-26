// src/cart/dto/update-cart.dto.ts
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
