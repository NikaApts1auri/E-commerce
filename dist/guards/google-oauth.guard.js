"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOauthGuard = void 0;
const passport_1 = require("@nestjs/passport");
class GoogleOauthGuard extends (0, passport_1.AuthGuard)('google') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.query.error) {
            return true;
        }
        return super.canActivate(context);
    }
}
exports.GoogleOauthGuard = GoogleOauthGuard;
//# sourceMappingURL=google-oauth.guard.js.map