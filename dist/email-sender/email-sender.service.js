"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSenderService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let EmailSenderService = class EmailSenderService {
    mailerService;
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendEmailSomeone({ subject, to, text, html, }) {
        try {
            await this.mailerService.sendMail({
                to,
                from: 'E-commerce <afciaurinikusha28@gmail.com>',
                subject,
                text,
                html,
            });
            console.log(`[Email Success] წერილი წარმატებით გაეგზავნა: ${to}`);
        }
        catch (error) {
            console.error(`[Email Error] ვერ გაიგზავნა ${to}-ზე:`, error);
            throw new common_1.InternalServerErrorException(`იმეილის გაგზავნა ჩავარდა: ${to}`);
        }
    }
    async sendBulkEmails(emails, subject, text) {
        const uniqueEmails = [...new Set(emails)];
        const emailPromises = uniqueEmails.map((to) => this.sendEmailSomeone({ subject, to, text }));
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
};
exports.EmailSenderService = EmailSenderService;
exports.EmailSenderService = EmailSenderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailSenderService);
//# sourceMappingURL=email-sender.service.js.map