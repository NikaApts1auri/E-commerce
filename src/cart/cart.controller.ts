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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: { id: string };
}
@ApiTags('cart')
@Controller('cart')
@UseGuards(IsAuthGuard) // დაცვა მთლიანად კლასზე ან მეთოდზე
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'პროდუქტის კალათაში დამატება' })
  @ApiResponse({ status: 201, description: 'პროდუქტი წარმატებით დაემატა' })
  @Post()
  async addToCart(@Req() req: RequestWithUser, @Body() dto: AddToCartDto) {
    const userId = new Types.ObjectId(req.user.id);
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.cartService.addItem(userId, dto);
  }
  //
  @ApiOperation({ summary: 'კალათის მიღება' })
  @Get()
  async getCart(@Req() req: RequestWithUser) {
    const userId = req.user?.id; // თუ დალოგინებულია
    const guestId = req.cookies?.guestId; // თუ სტუმარია

    return this.cartService.getCart(userId, guestId);
  }
  //
  @ApiOperation({ summary: 'პროდუქტის წაშლა კალათიდან' })
  @ApiParam({ name: 'productId', description: 'პროდუქტის უნიკალური ID' })
  @Delete(':productId')
  async removeItem(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  //

  @ApiOperation({ summary: 'მთლიანი კალათის გასუფთავება' })
  @Delete('clear')
  async clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.id);
  }
  //
  @ApiOperation({ summary: 'კალათაში პროდუქტის რაოდენობის განახლება' })
  @Patch()
  async updateItem(@Req() req: RequestWithUser, @Body() dto: UpdateCartDto) {
    return this.cartService.updateItem(req.user.id, dto);
  }
}
