export declare class EmailSenderService {
    private resend;
    sendEmailSomeone({ to, subject, text, html }: any): Promise<void>;
    sendBulkEmails(emails: string[], subject: string, text: string): Promise<any>;
}
