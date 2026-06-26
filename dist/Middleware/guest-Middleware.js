"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestMiddleware = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let GuestMiddleware = class GuestMiddleware {
    use(req, res, next) {
        if (!req.cookies || !req.cookies.guestId) {
            const guestId = (0, uuid_1.v4)();
            res.cookie('guestId', guestId, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            req['guestId'] = guestId;
        }
        else {
            req['guestId'] = req.cookies.guestId;
        }
        next();
    }
};
exports.GuestMiddleware = GuestMiddleware;
exports.GuestMiddleware = GuestMiddleware = __decorate([
    (0, common_1.Injectable)()
], GuestMiddleware);
//# sourceMappingURL=guest-Middleware.js.map