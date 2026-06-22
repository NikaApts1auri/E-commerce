import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './email-sender/dto/send-email.dto';
import { EmailSenderService } from './email-sender/email-sender.service';

@Injectable()
export class AppService {
  constructor(private readonly emailSenderService: EmailSenderService) {}

  getHello(): string {
    return 'Welcome to E-commerce API v1.0';
  }

  async sendEmailToSomeone(sendEmailDto: SendEmailDto) {
    const targetEmails = [
      'nika.aptsiauri@ciu.edu.ge',
      'nika.aptsiauri@ciu.edu.ge', // დუბლიკატი ავტომატურად მოიშლება
      'another.user@example.com',
    ];

    return await this.emailSenderService.sendBulkEmails(
      targetEmails,
      sendEmailDto.subject,
      sendEmailDto.text,
    );
  }
}
