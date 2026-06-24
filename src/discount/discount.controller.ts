import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Roles } from 'src/decorators/role.decorator';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { Role } from 'src/enums/roles.enum';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @UseGuards(IsAdminGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }
  @Get()
  async findAll(@Query('active') active?: string) {
    ///discount?active=tru
    const onlyActive = active === 'true';
    return this.discountService.findAll(onlyActive);
  }
}
