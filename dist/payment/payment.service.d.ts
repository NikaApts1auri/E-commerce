import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';
export declare class PaymentService {
    private readonly configService;
    private stripe;
    orderService: any;
    constructor(configService: ConfigService);
    createPaymentIntent(orderId: string, amount: number): Promise<{
        clientSecret: string | null;
    }>;
    constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event;
    handleWebhookEvent(rawBody: Buffer, sig: string): Promise<void>;
}
