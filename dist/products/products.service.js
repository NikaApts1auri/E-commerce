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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schema/product.schema");
const aws_s3_service_1 = require("../aws-s3/aws-s3.service");
let ProductsService = class ProductsService {
    productModel;
    awsS3Service;
    constructor(productModel, awsS3Service) {
        this.productModel = productModel;
        this.awsS3Service = awsS3Service;
    }
    async findAll(search, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        let query = { isDeleted: { $ne: true } };
        if (search) {
            query = {
                $and: [
                    { isDeleted: { $ne: true } },
                    {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { productCode: { $regex: search, $options: 'i' } },
                        ],
                    },
                ],
            };
        }
        const [products, total] = await Promise.all([
            this.productModel.find(query).skip(skip).limit(limit).exec(),
            this.productModel.countDocuments(query),
        ]);
        return {
            products,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
    async generateUniqueProductCode() {
        let isUnique = false;
        let code = '';
        while (!isUnique) {
            code = Math.floor(10000 + Math.random() * 90000).toString();
            const existing = await this.productModel.findOne({ productCode: code });
            if (!existing) {
                isUnique = true;
            }
        }
        return code;
    }
    async create(createProductDto) {
        const autoProductCode = await this.generateUniqueProductCode();
        const newProduct = new this.productModel({
            ...createProductDto,
            productCode: autoProductCode,
        });
        return await newProduct.save();
    }
    async createWithImage(createProductDto, file) {
        if (!file)
            throw new common_1.BadRequestException('პროდუქტის ფოტო სავალდებულოა');
        const autoProductCode = await this.generateUniqueProductCode();
        const filePath = `products/${Date.now()}_${file.originalname}`;
        await this.awsS3Service.uploadFile(filePath, file);
        const imageUrl = await this.awsS3Service.getFile(filePath);
        const newProduct = new this.productModel({
            ...createProductDto,
            productCode: autoProductCode,
            image: imageUrl,
        });
        return await newProduct.save();
    }
    async remove(id) {
        const deletedProduct = await this.productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deletedProduct) {
            throw new common_1.NotFoundException('პროდუქტი ვერ მოიძებნა');
        }
        return { message: 'პროდუქტი წარმატებით წაიშალა (Soft Delete)' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        aws_s3_service_1.AwsS3Service])
], ProductsService);
//# sourceMappingURL=products.service.js.map