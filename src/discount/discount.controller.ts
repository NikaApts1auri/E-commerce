import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Roles } from 'src/decorators/role.decorator';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { Role } from 'src/enums/roles.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('discount')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @ApiOperation({
    summary: 'ახალი ფასდაკლების შექმნა (მხოლოდ ადმინისტრატორისთვის)',
  })
  @ApiResponse({ status: 201, description: 'ფასდაკლება წარმატებით შეიქმნა' })
  @ApiResponse({ status: 403, description: 'წვდომა აკრძალულია' })
  @Post()
  @ApiSecurity('token')
  @UseGuards(IsAdminGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @ApiOperation({ summary: 'ფასდაკლებების სიის მიღება' })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'თუ true-ა, აბრუნებს მხოლოდ აქტიურ ფასდაკლებებს',
  })
  @ApiResponse({
    status: 200,
    description: 'ფასდაკლებების სია წარმატებით დაბრუნდა',
  })
  @Get()
  async findAll(@Query('active') active?: string) {
    ///discount?active=tru
    const onlyActive = active === 'true';
    return this.discountService.findAll(onlyActive);
  }
}
