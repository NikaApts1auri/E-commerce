"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSenderService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailSenderService = class EmailSenderService {
    resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    async sendEmailSomeone({ to, subject, text, html }) {
        console.log('Checking API Key:', process.env.RESEND_API_KEY ? 'Key exists' : 'Key is MISSING!');
        try {
            const data = await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: to,
                subject: subject,
                text: text,
                html: html,
            });
            console.log('Resend API Response:', data);
        }
        catch (error) {
            console.error('CRITICAL EMAIL ERROR:', error);
            throw error;
        }
    }
    async sendBulkEmails(emails, subject, text) {
        const uniqueEmails = [...new Set(emails)];
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
};
exports.EmailSenderService = EmailSenderService;
exports.EmailSenderService = EmailSenderService = __decorate([
    (0, common_1.Injectable)()
], EmailSenderService);
//# sourceMappingURL=email-sender.service.js.map