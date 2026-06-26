import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(): Promise<void>;
    googleRedirect(req: any, res: Response): Promise<void>;
    signUp(signUpDto: SignUpDto): Promise<string>;
    signIn(signInDto: SignInDto, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: any): Promise<{
        success: boolean;
        message: string;
    }>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
}
