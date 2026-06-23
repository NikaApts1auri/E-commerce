import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IsAdminGuard } from 'src/guards/is-admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // მაგალითად: /products?search=iPhone&page=1&limit=5
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.productsService.findAll(search, pageNumber, limitNumber);
  }

  //

  @Post()
  @UseGuards(IsAdminGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  //
  @Delete(':id')
  @UseGuards(IsAdminGuard)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
