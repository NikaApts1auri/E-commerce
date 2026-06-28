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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 დღე
    });

    return res.redirect(`${process.env.FRONT_URL}/dashboard`);
  }

  @ApiOperation({ summary: 'მომხმარებლის რეგისტრაცია' })
  @ApiResponse({ status: 201, description: 'წარმატებით დარეგისტრირდა' })
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  
  @ApiOperation({ summary: 'მომხმარებლის შესვლა სისტემაში' })
  @ApiResponse({ status: 200, description: 'წარმატებული ავტორიზაცია' })
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { accessToken } = await this.authService.signIn(signInDto);

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 დღე
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      accessToken: accessToken,
    });
  }

  @ApiOperation({ summary: 'პაროლის აღდგენის მოთხოვნა' })
  @ApiResponse({ status: 200, description: 'ინსტრუქცია გაიგზავნა ფოსტაზე' })
  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.authService.forgotPassword(email);

    return {
      success: true,
      message: 'პაროლის აღდგენის ინსტრუქცია გაიგზავნა მითითებულ ელ-ფოსტაზე.',
    };
  }

  @ApiOperation({ summary: 'პაროლის განახლება' })
  @ApiResponse({ status: 200, description: 'პაროლი წარმატებით შეიცვალა' })
  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: any, // სასურველია შექმნა ცალკე DTO (token, newPassword)
  ) {
    // სერვისი შეამოწმებს ტოკენს და ბაზაში განაახლებს პაროლს ჰეშირებული ვერსიით
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );

    return {
      success: true,
      message: 'პაროლი წარმატებით შეიცვალა. შეგიძლიათ გაიაროთ ავტორიზაცია.',
    };
  }

  @ApiOperation({ summary: 'სისტემიდან გასვლა' })
  @ApiResponse({ status: 200, description: 'წარმატებით გავიდა სისტემიდან' })
  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res
      .status(200)
      .json({ success: true, message: 'Logged out successfully' });
  }
}
