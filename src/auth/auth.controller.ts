import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { GoogleOauthGuard } from 'src/guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleRedirect(@Req() req, @Res() res: Response) {
    if (req.query.error) {
      return res.redirect(
        `${process.env.FRONT_URL}/auth/sign-in?error=google_auth_cancelled`,
      );
    }

    const token = await this.authService.signInWithGoogle(req.user);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 დღე
    });

    //  რედირექტის დროს URL-ში ტოკენს აღარ ვატან
    return res.redirect(`${process.env.FRONT_URL}/dashboard`);
  }
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { accessToken } = await this.authService.signIn(signInDto);

    res.cookie('token', accessToken, {
      httpOnly: true, //ეს რომ false იყოს ქუქიში ეგრეცე გამოჩნდებოდა ტოკენი
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: 'Logged in successfully' });
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.status(200).json({ success: true, message: 'Logged out' });
  }
}
