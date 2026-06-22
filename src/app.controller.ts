import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SendEmailDto } from './email-sender/dto/send-email.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  async sendEmail(@Body() emailData: SendEmailDto) {
    const result = await this.appService.sendEmailToSomeone(emailData);

    return {
      success: true,
      message: 'იმეილების გაგზავნის მოთხოვნა შესრულდა',
      meta: result,
    };
  }
}
