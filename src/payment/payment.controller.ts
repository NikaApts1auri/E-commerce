import {
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Stripe Webhook',
    description:
      'ეს ენდპოინტი გამოიყენება მხოლოდ Stripe-ის მიერ გადახდის სტატუსის განახლებისთვის. მომხმარებლისთვის არ არის განკუთვნილი.',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe-ის მიერ გამოგზავნილი დაცვის ხელმოწერა',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Webhook წარმატებით მიღებულია' })
  @ApiResponse({
    status: 400,
    description: 'არასწორი მოთხოვნა (Missing Raw Body)',
  })
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
