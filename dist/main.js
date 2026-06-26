"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const serverless_express_1 = require("@vendia/serverless-express");
let server;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(','),
        credentials: true,
    });
    await app.init();
    return app.getHttpAdapter().getInstance();
}
const handler = async (event, context, callback) => {
    if (!server) {
        const expressApp = await bootstrap();
        server = (0, serverless_express_1.configure)({ app: expressApp });
    }
    return server(event, context, callback);
};
exports.handler = handler;
if (process.env.NODE_ENV !== 'production') {
    bootstrap().then((app) => {
        app.listen(process.env.PORT ?? 3000);
    });
}
//# sourceMappingURL=main.js.map