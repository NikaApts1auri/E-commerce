import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  orderService: any;

  constructor(private readonly configService: ConfigService) {
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
  //
  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
  //
  // src/payment/payment.service.ts
  async handleWebhookEvent(rawBody: Buffer, sig: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret!,
    );

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    switch (event.type) {
      case 'payment_intent.succeeded':
        if (orderId) await this.orderService.updateStatus(orderId, 'paid');
        break;
      case 'payment_intent.payment_failed':
        if (orderId) await this.orderService.updateStatus(orderId, 'failed');
        break;
    }
  }
}
