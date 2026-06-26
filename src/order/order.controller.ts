import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'ახალი შეკვეთის შექმნა' })
  @ApiResponse({ status: 201, description: 'შეკვეთა წარმატებით შეიქმნა' })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'შეკვეთის დეტალების მიღება ID-ით' })
  @ApiParam({ name: 'id', description: 'შეკვეთის უნიკალური ID' })
  @ApiResponse({ status: 200, description: 'შეკვეთის დეტალები' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }
}
