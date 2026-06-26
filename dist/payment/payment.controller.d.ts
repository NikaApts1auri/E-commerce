import { RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handleWebhook(req: RawBodyRequest<Request>, sig: string): Promise<{
        received: boolean;
    }>;
}
