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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const is_admin_guard_1 = require("../guards/is-admin.guard");
let ProductsController = class ProductsController {
    findAll() {
        return [
            { id: 1, name: 'iPhone 17 Pro', price: 1200 },
            { id: 2, name: 'MacBook Pro M5', price: 2000 },
        ];
    }
    create() {
        return {
            success: true,
            message: 'პროდუქტი წარმატებით დაემატა ადმინის მიერ!',
        };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products')
], ProductsController);
//# sourceMappingURL=products.controller.js.map