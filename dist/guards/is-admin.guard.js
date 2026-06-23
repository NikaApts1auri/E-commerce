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
exports.IsAdminGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const roles_enum_1 = require("../enums/roles.enum");
let IsAdminGuard = class IsAdminGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.token;
        if (!token) {
            throw new common_1.UnauthorizedException('Authentication token missing');
        }
        try {
            const payload = await this.jwtService.verify(token);
            if (payload.role !== roles_enum_1.Role.ADMIN) {
                throw new common_1.ForbiddenException('Permission denied. Admin role required.');
            }
            request.user = payload;
            return true;
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.IsAdminGuard = IsAdminGuard;
exports.IsAdminGuard = IsAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], IsAdminGuard);
//# sourceMappingURL=is-admin.guard.js.map