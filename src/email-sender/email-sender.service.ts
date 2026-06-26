import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailSenderService {
  constructor(private readonly mailerService: MailerService) {}

  // 1. მეთოდი ერთი იმეილის გასაგზავნად
  async sendEmailSomeone({
    subject,
    to,
    text,
    html,
  }: SendEmailDto & { html?: string }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        from: 'E-commerce <afciaurinikusha28@gmail.com>',
        subject,
        text,
        html,
      });
      console.log(`[Email Success] წერილი წარმატებით გაეგზავნა: ${to}`);
    } catch (error) {
      console.error(`[Email Error] ვერ გაიგზავნა ${to}-ზე:`, error);
      throw new InternalServerErrorException(`იმეილის გაგზავნა ჩავარდა: ${to}`);
    }
  }

  async sendBulkEmails(emails: string[], subject: string, text: string) {
    const uniqueEmails = [...new Set(emails)];

    const emailPromises = uniqueEmails.map((to) =>
      this.sendEmailSomeone({ subject, to, text }),
    );

    const results = await Promise.allSettled(emailPromises);

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return {
      message: 'მასობრივი გაგზავნის პროცესი დასრულდა',
      stats: {
        totalTarget: uniqueEmails.length,
        successful,
        failed,
      },
    };
  }
}
