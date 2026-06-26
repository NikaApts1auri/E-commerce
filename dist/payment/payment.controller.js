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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("./payment.service");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async handleWebhook(req, sig) {
        if (!req.rawBody) {
            throw new common_1.BadRequestException('Raw body is required');
        }
        await this.paymentService.handleWebhookEvent(req.rawBody, sig);
        return { received: true };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Stripe Webhook',
        description: 'ეს ენდპოინტი გამოიყენება მხოლოდ Stripe-ის მიერ გადახდის სტატუსის განახლებისთვის. მომხმარებლისთვის არ არის განკუთვნილი.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'stripe-signature',
        description: 'Stripe-ის მიერ გამოგზავნილი დაცვის ხელმოწერა',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook წარმატებით მიღებულია' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'არასწორი მოთხოვნა (Missing Raw Body)',
    }),
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleWebhook", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map