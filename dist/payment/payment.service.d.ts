import { ConfigService } from '@nestjs/config';
import { OrderService } from '../order/order.service';
export declare class PaymentService {
    private readonly configService;
    private readonly orderService;
    private stripe;
    constructor(configService: ConfigService, orderService: OrderService);
    createPaymentIntent(orderId: string, amount: number): Promise<{
        clientSecret: string | null;
    }>;
    handleWebhookEvent(rawBody: Buffer, sig: string): Promise<void>;
}
