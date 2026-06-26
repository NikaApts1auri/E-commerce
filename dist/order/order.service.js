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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schema/order.schema");
const product_schema_1 = require("../products/schema/product.schema");
const email_sender_service_1 = require("../email-sender/email-sender.service");
let OrderService = class OrderService {
    orderModel;
    productModel;
    userModel;
    emailService;
    constructor(orderModel, productModel, userModel, emailService) {
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.userModel = userModel;
        this.emailService = emailService;
    }
    async updateStatus(orderId, status) {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (status === 'paid') {
            await this.decrementInventory(updatedOrder);
            const user = await this.userModel.findById(updatedOrder.userId);
            if (user && user.email) {
                await this.emailService.sendEmailSomeone({
                    to: user.email,
                    subject: 'თქვენი შეკვეთა წარმატებით გადაიხადეთ!',
                    text: `გამარჯობა! თქვენი შეკვეთა #${orderId} დამუშავებულია.`,
                    html: `<h1>მადლობა შენაძენისთვის!</h1>`,
                });
            }
        }
        return updatedOrder;
    }
    async decrementInventory(order) {
        for (const item of order.items) {
            const productId = item.productId || item._id;
            await this.productModel.findByIdAndUpdate(productId, {
                $inc: { stock: -1 },
            });
        }
        console.log(`Inventory decremented for order: ${order._id}`);
    }
    async create(createOrderDto) {
        const newOrder = new this.orderModel(createOrderDto);
        return await newOrder.save();
    }
    async findOne(id) {
        const order = await this.orderModel
            .findById(id)
            .populate('items.productId')
            .exec();
        if (!order) {
            throw new common_1.NotFoundException(`შეკვეთა ID-ით ${id} ვერ მოიძებნა`);
        }
        return order;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        email_sender_service_1.EmailSenderService])
], OrderService);
//# sourceMappingURL=order.service.js.map