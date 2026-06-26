import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Delete,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { IsAuthGuard } from '../guards/is-auth.guard';
import { Request } from 'express';
import { Types } from 'mongoose';
import { UpdateCartDto } from './dto/update-cart.dto';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('cart')
@UseGuards(IsAuthGuard) // დაცვა მთლიანად კლასზე ან მეთოდზე
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(@Req() req: RequestWithUser, @Body() dto: AddToCartDto) {
    const userId = new Types.ObjectId(req.user.id);
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.cartService.addItem(userId, dto);
  }
  //
  @Get()
  async getCart(@Req() req: RequestWithUser) {
    const userId = req.user?.id; // თუ დალოგინებულია
    const guestId = req.cookies?.guestId; // თუ სტუმარია

    return this.cartService.getCart(userId, guestId);
  }
  //
  @Delete(':productId')
  async removeItem(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  //
  // მთლიანი კალათის გასუფთავება
  @Delete('clear')
  async clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.id);
  }
  //
  @Patch()
  async updateItem(@Req() req: RequestWithUser, @Body() dto: UpdateCartDto) {
    return this.cartService.updateItem(req.user.id, dto);
  }
}
