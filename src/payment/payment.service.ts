import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';
import { OrderService } from '../order/order.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new InternalServerErrorException(
        'STRIPE_SECRET_KEY is not defined',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-06-24.dahlia',
    });
  }

  async createPaymentIntent(orderId: string, amount: number) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: { orderId },
      });
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      throw new InternalServerErrorException(`Stripe Error: ${error.message}`);
    }
  }

  async handleWebhookEvent(rawBody: Buffer, sig: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    // ვერიფიკაცია
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret!);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error('Webhook received without orderId metadata');
      return;
    }

    // მოვლენების დამუშავება
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.orderService.updateStatus(orderId, 'paid');
        break;
      case 'payment_intent.payment_failed':
        await this.orderService.updateStatus(orderId, 'failed');
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
