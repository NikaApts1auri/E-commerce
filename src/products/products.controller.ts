import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsAdminGuard } from 'src/guards/is-admin.guard'; // 🚀 შენი ახალი გვარდი

@Controller('products')
export class ProductsController {
  @Get()
  findAll() {
    return [
      { id: 1, name: 'iPhone 17 Pro', price: 1200 },
      { id: 2, name: 'MacBook Pro M5', price: 2000 },
    ];
  }

  @Post('/create')
  @UseGuards(IsAdminGuard)
  create() {
    return {
      success: true,
      message: 'პროდუქტი წარმატებით დაემატა ადმინის მიერ!',
    };
  }
}
