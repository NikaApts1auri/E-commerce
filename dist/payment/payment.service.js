"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Stripe = require("stripe");
let PaymentService = class PaymentService {
    configService;
    stripe;
    orderService;
    constructor(configService) {
        this.configService = configService;
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new common_1.InternalServerErrorException('STRIPE_SECRET_KEY is not defined');
        }
        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2026-06-24.dahlia',
        });
    }
    async createPaymentIntent(orderId, amount) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'usd',
                metadata: { orderId },
            });
            return { clientSecret: paymentIntent.client_secret };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Stripe Error: ${error.message}`);
        }
    }
    constructWebhookEvent(rawBody, signature) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
        }
        try {
            return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
    }
    async handleWebhookEvent(rawBody, sig) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        const event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        switch (event.type) {
            case 'payment_intent.succeeded':
                if (orderId)
                    await this.orderService.updateStatus(orderId, 'paid');
                break;
            case 'payment_intent.payment_failed':
                if (orderId)
                    await this.orderService.updateStatus(orderId, 'failed');
                break;
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map