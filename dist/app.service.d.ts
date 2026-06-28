import { SendEmailDto } from './email-sender/dto/send-email.dto';
import { EmailSenderService } from './email-sender/email-sender.service';
export declare class AppService {
    private readonly emailSenderService;
    constructor(emailSenderService: EmailSenderService);
    getHello(): string;
    sendEmailToSomeone(sendEmailDto: SendEmailDto): Promise<any>;
}
