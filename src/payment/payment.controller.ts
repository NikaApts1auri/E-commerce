import {
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Res,
  Headers,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { OrderService } from '../order/order.service';
import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Raw body is required');
    }
    await this.paymentService.handleWebhookEvent(req.rawBody, sig);
    return { received: true };
  }
}
