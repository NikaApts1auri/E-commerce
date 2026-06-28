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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const email_sender_service_1 = require("../email-sender/email-sender.service");
let AuthService = class AuthService {
    userModel;
    jwtService;
    emailService;
    constructor(userModel, jwtService, emailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async forgotPassword(email) {
        console.log('Searching for user with email:', email);
        const user = await this.userModel.findOne({ email });
        console.log(`Password reset requested for: ${email}. User found: ${!!user}`);
        if (user) {
            const rawResetToken = crypto.randomBytes(32).toString('hex');
            const hashedResetToken = crypto
                .createHash('sha256')
                .update(rawResetToken)
                .digest('hex');
            const resetTokenExpires = new Date();
            resetTokenExpires.setMinutes(resetTokenExpires.getMinutes() + 15);
            await this.userModel.findByIdAndUpdate(user._id, {
                resetPasswordToken: hashedResetToken,
                resetPasswordExpires: resetTokenExpires,
            });
            const resetLink = `${process.env.FRONT_URL || 'http://localhost:3000'}/auth/reset-password?token=${rawResetToken}`;
            try {
                console.log('Sending email...');
                await this.emailService.sendEmailSomeone({
                    to: user.email,
                    subject: 'პაროლის აღდგენა - E-commerce',
                    text: `პაროლის აღდგენის ბმული: ${resetLink}`,
                    html: `<p>პაროლის შესაცვლელად გადადით <a href="${resetLink}">ბმულზე</a></p>`,
                });
                console.log('Email successfully sent!');
            }
            catch (err) {
                console.error('Resend API Error:', err.response?.data || err.message);
                throw err;
            }
        }
        return {
            message: 'თუ ელ-ფოსტა რეგისტრირებულია, თქვენ მიიღებთ აღდგენის ინსტრუქციას.',
        };
    }
    async resetPassword(token, newPassword) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const hashedPass = await bcrypt.hash(newPassword, 10);
        const user = await this.userModel.findOneAndUpdate({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        }, {
            password: hashedPass,
            $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
        }, { new: true });
        if (!user) {
            throw new common_1.BadRequestException('ბმული არასწორია ან ვადა გაუვიდა');
        }
        return { message: 'პაროლი წარმატებით განახლდა' };
    }
    async signIn({ email, password }) {
        const existUser = await this.userModel
            .findOne({ email })
            .select('+password');
        if (!existUser)
            throw new common_1.BadRequestException('Invalid Credentials');
        if (!existUser.password) {
            throw new common_1.BadRequestException('Invalid Credentials');
        }
        const isPassedEqual = await bcrypt.compare(password, existUser.password);
        if (!isPassedEqual)
            throw new common_1.BadRequestException('Invalid Credentials');
        const payLoad = {
            id: existUser._id,
            role: existUser.role,
        };
        const accessToken = await this.jwtService.sign(payLoad, {
            expiresIn: '1h',
        });
        return { accessToken };
    }
    async signInWithGoogle(user) {
        let existsUser = await this.userModel.findOne({ email: user.email });
        if (!existsUser) {
            existsUser = await this.userModel.create({
                email: user.email,
                avatar: user.avatar,
                fullName: user.fullName,
                isVerified: true,
            });
        }
        existsUser.avatar = user.avatar;
        await existsUser.save();
        const payLoad = {
            id: existsUser._id,
            role: existsUser.role,
        };
        const accessToken = await this.jwtService.sign(payLoad, {
            expiresIn: '1h',
        });
        return accessToken;
    }
    async signUp({ email, fullName, password }) {
        const existUser = await this.userModel.findOne({ email: email });
        if (existUser)
            throw new common_1.BadRequestException('User Already exists');
        const hashedPass = await bcrypt.hash(password, 10);
        await this.userModel.create({ email, password: hashedPass, fullName });
        return 'user created successfully';
    }
    async getCurrentUser(userId) {
        return await this.userModel.findById(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        email_sender_service_1.EmailSenderService])
], AuthService);
//# sourceMappingURL=auth.service.js.map