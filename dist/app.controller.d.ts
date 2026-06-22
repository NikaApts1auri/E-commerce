import { AppService } from './app.service';
import { SendEmailDto } from './email-sender/dto/send-email.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    sendEmail(emailData: SendEmailDto): Promise<{
        success: boolean;
        message: string;
        meta: {
            message: string;
            stats: {
                totalTarget: number;
                successful: number;
                failed: number;
            };
        };
    }>;
}
