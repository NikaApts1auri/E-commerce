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

  // 2. Best Practice: მეთოდი მასობრივი (Bulk) იმეილების უსაფრთხოდ გასაგზავნად
  async sendBulkEmails(emails: string[], subject: string, text: string) {
    // მასივიდან დუბლიკატების მოშორება
    const uniqueEmails = [...new Set(emails)];

    // პრომისების მომზადება
    const emailPromises = uniqueEmails.map((to) =>
      this.sendEmailSomeone({ subject, to, text }),
    );

    // უსაფრთხო პარალელური გაგზავნა (არ ფეთქდება ერთ შეცდომაზე)
    const results = await Promise.allSettled(emailPromises);

    // სტატისტიკის მომზადება (სასარგებლოა რეპორტინგისთვის)
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
