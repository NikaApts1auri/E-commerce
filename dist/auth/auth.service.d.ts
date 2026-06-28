import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { EmailSenderService } from "../email-sender/email-sender.service";
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from "../users/schema/user.entity";
export declare class AuthService {
    private userModel;
    private jwtService;
    private emailService;
    constructor(userModel: Model<User>, jwtService: JwtService, emailService: EmailSenderService);
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    signIn({ email, password }: SignInDto): Promise<{
        accessToken: string;
    }>;
    signInWithGoogle(user: any): Promise<string>;
    signUp({ email, fullName, password }: SignUpDto): Promise<string>;
    getCurrentUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
