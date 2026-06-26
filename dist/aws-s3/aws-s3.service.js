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
exports.AwsS3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
let AwsS3Service = class AwsS3Service {
    storageService;
    bucketName;
    constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME;
        this.storageService = new client_s3_1.S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_REGION,
        });
    }
    async uploadFile(filePath, file) {
        if (!filePath || !file)
            throw new common_1.BadRequestException('File is required');
        try {
            const config = {
                Key: filePath,
                Bucket: this.bucketName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const uploadCommand = new client_s3_1.PutObjectCommand(config);
            await this.storageService.send(uploadCommand);
            return filePath;
        }
        catch (e) {
            console.log(e, 'eent');
            throw new common_1.BadRequestException('Could not upload file');
        }
    }
    async getFile(filePath) {
        if (!filePath)
            throw new common_1.BadRequestException('File path is required');
        const cloudFrontUrl = process.env.CLOUD_FRONT_URL;
        if (!cloudFrontUrl) {
            throw new common_1.BadRequestException('CLOUD_FRONT_URL is missing in .env file');
        }
        const cleanBaseUrl = cloudFrontUrl.endsWith('/')
            ? cloudFrontUrl.slice(0, -1)
            : cloudFrontUrl;
        const cleanFilePath = filePath.startsWith('/')
            ? filePath.slice(1)
            : filePath;
        return `${cleanBaseUrl}/${cleanFilePath}`;
    }
    async deleteFile(filePath) {
        if (!filePath)
            throw new common_1.BadRequestException('File path is required');
        const config = {
            Bucket: this.bucketName,
            Key: filePath,
        };
        const deleteCommand = new client_s3_1.DeleteObjectCommand(config);
        await this.storageService.send(deleteCommand);
        return 'deleted successfully';
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map