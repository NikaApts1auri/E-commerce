"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const aws_s3_module_1 = require("./aws-s3/aws-s3.module");
const email_sender_module_1 = require("./email-sender/email-sender.module");
const mailer_1 = require("@nestjs-modules/mailer");
const app_service_1 = require("./app.service");
const app_controller_1 = require("./app.controller");
const products_module_1 = require("./products/products.module");
const discount_module_1 = require("./discount/discount.module");
const cart_module_1 = require("./cart/cart.module");
const guest_Middleware_1 = require("./Middleware/guest-Middleware");
const payment_module_1 = require("./payment/payment.module");
const order_module_1 = require("./order/order.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(guest_Middleware_1.GuestMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URL),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT),
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                },
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            aws_s3_module_1.AwsS3Module,
            email_sender_module_1.EmailSenderModule,
            products_module_1.ProductsModule,
            discount_module_1.DiscountModule,
            cart_module_1.CartModule,
            payment_module_1.PaymentModule,
            order_module_1.OrderModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map