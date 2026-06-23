import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  private storageService;
  private bucketName;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.storageService = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(filePath: string, file) {
    if (!filePath || !file) throw new BadRequestException('File is required');
    try {
      const config = {
        Key: filePath,
        Bucket: this.bucketName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const uploadCommand = new PutObjectCommand(config);
      await this.storageService.send(uploadCommand);
      return filePath;
    } catch (e) {
      console.log(e, 'eent');
      throw new BadRequestException('Could not upload file');
    }
  }

  // 🚀 აი აქ გავასწორეთ და დავაზღვიეთ სლაშების პრობლემა:
  async getFile(filePath: string) {
    if (!filePath) throw new BadRequestException('File path is required');

    const cloudFrontUrl = process.env.CLOUD_FRONT_URL;
    if (!cloudFrontUrl) {
      throw new BadRequestException('CLOUD_FRONT_URL is missing in .env file');
    }

    // თუ .env-ში ლინკი ბოლოვდება სლაშით (https://domain.com/), ჩამოვაჭრათ
    const cleanBaseUrl = cloudFrontUrl.endsWith('/')
      ? cloudFrontUrl.slice(0, -1)
      : cloudFrontUrl;

    // თუ filePath იწყება სლაშით (/products/...), ჩამოვაჭრათ დასაწყისი სლაში
    const cleanFilePath = filePath.startsWith('/')
      ? filePath.slice(1)
      : filePath;

    // ვაერთებთ სუფთად, რომ მივიღოთ: https://domain.com/products/image.png
    return `${cleanBaseUrl}/${cleanFilePath}`;
  }

  async deleteFile(filePath: string) {
    if (!filePath) throw new BadRequestException('File path is required');
    const config = {
      Bucket: this.bucketName,
      Key: filePath,
    };
    const deleteCommand = new DeleteObjectCommand(config);
    await this.storageService.send(deleteCommand);
    return 'deleted successfully';
  }
}
