// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { SendEmailDto } from './dto/send-email.dto';

// @Injectable()
// export class EmailSenderService {
//   constructor(private readonly mailerService: MailerService) {}

//   // 1. მეთოდი ერთი იმეილის გასაგზავნად
//   async sendEmailSomeone({
//     subject,
//     to,
//     text,
//     html,
//   }: SendEmailDto & { html?: string }): Promise<void> {
//     console.log('--- STARTING EMAIL SENDING ---');
//     console.log('To:', to);
//     try {
//       await this.mailerService.sendMail({
//         to,
//         from: 'E-commerce <afciaurinikusha28@gmail.com>',
//         subject,
//         text,
//         html,
//       });
//       console.log('--- EMAIL SENT SUCCESSFULLY ---');
//     } catch (error) {
//       console.error('--- EMAIL FAILED TO SEND ---');
//       console.error('Error Details:', error);
//       throw new InternalServerErrorException(`იმეილის გაგზავნა ჩავარდა: ${to}`);
//     }
//   }

//   async sendBulkEmails(emails: string[], subject: string, text: string) {
//     const uniqueEmails = [...new Set(emails)];

//     const emailPromises = uniqueEmails.map((to) =>
//       this.sendEmailSomeone({ subject, to, text }),
//     );

//     const results = await Promise.allSettled(emailPromises);

//     const successful = results.filter((r) => r.status === 'fulfilled').length;
//     const failed = results.filter((r) => r.status === 'rejected').length;

//     return {
//       message: 'მასობრივი გაგზავნის პროცესი დასრულდა',
//       stats: {
//         totalTarget: uniqueEmails.length,
//         successful,
//         failed,
//       },
//     };
//   }
// }
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailSenderService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendEmailSomeone({ to, subject, text, html }: any): Promise<void> {
    console.log(
      'Checking API Key:',
      process.env.RESEND_API_KEY ? 'Key exists' : 'Key is MISSING!',
    );

    try {
      const data = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: subject,
        text: text,
        html: html,
      });
      console.log('Resend API Response:', data); // ეს დაგვანახებს რა მოხდა
    } catch (error) {
      console.error('CRITICAL EMAIL ERROR:', error);
      throw error;
    }
  }

  // email-sender.service.ts -ში დაამატე ეს მეთოდი
  async sendBulkEmails(
    emails: string[],
    subject: string,
    text: string,
  ): Promise<any> {
    const uniqueEmails = [...new Set(emails)];

    // Resend-ით თითოეული მეილის გაგზავნა
    const emailPromises = uniqueEmails.map(async (to) => {
      return await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: subject,
        text: text,
      });
    });

    return await Promise.all(emailPromises);
  }
}
