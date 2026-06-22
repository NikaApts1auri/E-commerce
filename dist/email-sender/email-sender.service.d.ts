import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';
export declare class EmailSenderService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmailSomeone({ subject, to, text, html, }: SendEmailDto & {
        html?: string;
    }): Promise<void>;
    sendBulkEmails(emails: string[], subject: string, text: string): Promise<{
        message: string;
        stats: {
            totalTarget: number;
            successful: number;
            failed: number;
        };
    }>;
}
