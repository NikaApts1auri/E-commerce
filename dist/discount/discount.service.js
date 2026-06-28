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
exports.DiscountService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../products/schema/product.schema");
const discount_schema_1 = require("./schema/discount.schema");
let DiscountService = class DiscountService {
    discountModel;
    productModel;
    constructor(discountModel, productModel) {
        this.discountModel = discountModel;
        this.productModel = productModel;
    }
    async create(createDiscountDto) {
        const { percentage, name, saleName, productCode } = createDiscountDto;
        if (!name && !productCode) {
            throw new common_1.BadRequestException('გთხოვთ მიუთითოთ პროდუქტის სახელი ან კოდი');
        }
        const searchCondition = name ? { name } : { productCode };
        const foundProduct = await this.productModel
            .findOne({ isDeleted: { $ne: true }, ...searchCondition })
            .exec();
        if (!foundProduct) {
            throw new common_1.BadRequestException('მითითებული პროდუქტი ვერ მოიძებნა');
        }
        const productIdStr = foundProduct._id.toString();
        const existingActiveDiscount = await this.getActiveDiscountForProduct(productIdStr);
        if (existingActiveDiscount) {
            throw new common_1.BadRequestException('ამ პროდუქტზე უკვე არსებობს აქტიური ფასდაკლება!');
        }
        const oldPrice = foundProduct.price;
        const newPrice = oldPrice - (oldPrice * percentage) / 100;
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);
        const newDiscount = new this.discountModel({
            name: foundProduct.name,
            saleName: `Sale for ${foundProduct.name}`,
            percentage,
            priceDetails: {
                oldPrice: foundProduct.price,
                newPrice: foundProduct.price - (foundProduct.price * percentage) / 100,
            },
            applicableProducts: [foundProduct._id],
            startDate: now,
            endDate: oneMonthLater,
            isActive: true,
        });
        return newDiscount.save();
    }
    async findAll(onlyActive) {
        let query = {};
        if (onlyActive) {
            const now = new Date();
            query = {
                isActive: true,
                startDate: { $lte: now },
                endDate: { $gte: now },
            };
        }
        return this.discountModel
            .find(query)
            .populate({
            path: 'applicableProducts',
            model: 'Product',
            select: 'name productCode price image description stock',
        })
            .exec();
    }
    async getActiveDiscountForProduct(productId) {
        const now = new Date();
        return this.discountModel
            .findOne({
            applicableProducts: productId,
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
        })
            .exec();
    }
};
exports.DiscountService = DiscountService;
exports.DiscountService = DiscountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(discount_schema_1.Discount.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DiscountService);
//# sourceMappingURL=discount.service.js.map