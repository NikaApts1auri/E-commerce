import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    // აქ იქმნება შეკვეთა მონაცემთა ბაზაში
    return await this.orderService.create(createOrderDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // აქ შეგიძლია შეამოწმო, რა სტატუსი აქვს შენს შეკვეთას
    return await this.orderService.findOne(id);
  }
}
