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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schema/cart.schema");
const product_schema_1 = require("../products/schema/product.schema");
let CartService = class CartService {
    cartModel;
    productModel;
    connection;
    constructor(cartModel, productModel, connection) {
        this.cartModel = cartModel;
        this.productModel = productModel;
        this.connection = connection;
    }
    async addItem(userId, dto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const { productId, quantity } = dto;
            const product = await this.productModel
                .findById(productId)
                .session(session)
                .lean();
            if (!product)
                throw new common_1.NotFoundException('Product not found');
            if (product.stock < quantity) {
                throw new common_1.BadRequestException('Not enough stock available');
            }
            const updated = await this.cartModel.findOneAndUpdate({
                userId: new mongoose_2.Types.ObjectId(userId),
                'items.productId': new mongoose_2.Types.ObjectId(productId),
            }, {
                $inc: {
                    'items.$.quantity': quantity,
                    totalAmount: product.price * quantity,
                },
            }, { new: true, session });
            if (!updated) {
                await this.cartModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, {
                    $push: { items: { productId, quantity, price: product.price } },
                    $inc: { totalAmount: product.price * quantity },
                }, { upsert: true, new: true, session });
            }
            await session.commitTransaction();
            return { message: 'Success' };
        }
        catch (error) {
            await session.abortTransaction();
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Transaction failed: ' + error.message);
        }
        finally {
            session.endSession();
        }
    }
    async getCart(userId, guestId) {
        const query = {};
        if (userId) {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        else if (guestId) {
            query.guestId = guestId;
        }
        else {
            throw new common_1.BadRequestException('User identification is missing');
        }
        const cart = await this.cartModel
            .findOne(query)
            .populate('items.productId')
            .lean()
            .exec();
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        return cart;
    }
    async updateItem(userId, dto) {
        const { productId, quantity } = dto;
        const uId = new mongoose_2.Types.ObjectId(userId);
        const pId = new mongoose_2.Types.ObjectId(productId);
        const product = await this.productModel.findById(pId).lean();
        const cart = await this.cartModel.findOne({ userId: uId });
        const item = cart?.items.find((i) => i.productId.toString() === productId);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const quantityDiff = quantity - item.quantity;
        const priceDiff = quantityDiff * product.price;
        return this.cartModel
            .findOneAndUpdate({ userId: uId, 'items.productId': pId }, {
            $set: { 'items.$.quantity': quantity },
            $inc: { totalAmount: priceDiff },
        }, { new: true })
            .populate('items.productId');
    }
    async mergeCarts(userId, guestCartId) {
        const userCart = await this.cartModel.findOne({ userId });
        const guestCart = await this.cartModel.findOne({ _id: guestCartId });
        if (!guestCart)
            return;
        if (!userCart) {
            await this.cartModel.updateOne({ _id: guestCartId }, { userId });
        }
        else {
            for (const item of guestCart.items) {
                const existingItem = userCart.items.find((i) => i.productId.toString() === item.productId.toString());
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                }
                else {
                    userCart.items.push(item);
                }
            }
            userCart.totalAmount += guestCart.totalAmount;
            await userCart.save();
            await this.cartModel.findByIdAndDelete(guestCartId);
        }
    }
    async removeItem(userId, productId) {
        const pId = new mongoose_2.Types.ObjectId(productId);
        const uId = new mongoose_2.Types.ObjectId(userId);
        const cart = await this.cartModel.findOne({ userId: uId });
        const item = cart?.items.find((i) => i.productId.toString() === productId);
        if (!item)
            throw new common_1.NotFoundException('Item not found in cart');
        return this.cartModel.findOneAndUpdate({ userId: uId }, {
            $pull: { items: { productId: pId } },
            $inc: { totalAmount: -(item.price * item.quantity) },
        }, { new: true });
    }
    async clearCart(userId) {
        return this.cartModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, {
            $set: { items: [], totalAmount: 0 },
        }, { new: true });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection])
], CartService);
//# sourceMappingURL=cart.service.js.map