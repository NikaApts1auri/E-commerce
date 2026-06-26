import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
declare const GoogleOauthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleOauthGuard extends GoogleOauthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
export {};
