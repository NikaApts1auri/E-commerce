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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Stripe = require("stripe");
const order_service_1 = require("../order/order.service");
let PaymentService = class PaymentService {
    configService;
    orderService;
    stripe;
    constructor(configService, orderService) {
        this.configService = configService;
        this.orderService = orderService;
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
    async handleWebhookEvent(rawBody, sig) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
            console.error('Webhook received without orderId metadata');
            return;
        }
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => order_service_1.OrderService))),
    __metadata("design:paramtypes", [config_1.ConfigService,
        order_service_1.OrderService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map