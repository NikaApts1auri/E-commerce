import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from 'src/users/schema/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailSenderService,
  ) {}

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });

    // უსაფრთხოების დაცვა: არ ვამჟღავნებთ არსებობს თუ არა იუზერი
    if (user) {
      const rawResetToken = crypto.randomBytes(32).toString('hex');

      // უსაფრთხოება: ბაზაში ვინახავთ დაჰეშილ ტოკენს
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

      // მომხმარებელს მეილზე მისდის ორიგინალი (raw) ტოკენი
      const resetLink = `${process.env.FRONT_URL || 'http://localhost:3000'}/auth/reset-password?token=${rawResetToken}`;

      // მეილის გაგზავნა ფონურ რეჟიმში (await-ის გარეშე, რომ იუზერმა დიდხანს არ ელოდოს პასუხს)
      await this.emailService
        .sendEmailSomeone({
          to: user.email,
          subject: 'პაროლის აღდგენა - E-commerce',
          text: `პაროლის აღდგენის ბმული: ${resetLink}`,
          html: `<p>პაროლის შესაცვლელად გადადით <a href="${resetLink}">ბმულზე</a></p>`,
        })
        .catch((err) => console.error('Email sending failed:', err));
    }

    return {
      message:
        'თუ ელ-ფოსტა რეგისტრირებულია, თქვენ მიიღებთ აღდგენის ინსტრუქციას.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // მოსული ტოკენის დაჰეშვა ბაზის ჩანაწერთან შესადარებლად
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const hashedPass = await bcrypt.hash(newPassword, 10);

    //  ძებნა და განახლება ერთდროულად
    const user = await this.userModel.findOneAndUpdate(
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      },
      {
        password: hashedPass,
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
      },
      { new: true },
    );

    if (!user) {
      throw new BadRequestException('ბმული არასწორია ან ვადა გაუვიდა');
    }

    return { message: 'პაროლი წარმატებით განახლდა' };
  }

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel
      .findOne({ email })
      .select('+password');
    if (!existUser) throw new BadRequestException('Invalid Credentials');

    if (!existUser.password) {
      throw new BadRequestException('Invalid Credentials');
    }

    const isPassedEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassedEqual) throw new BadRequestException('Invalid Credentials');

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

  async signUp({ email, fullName, password }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email: email });
    if (existUser) throw new BadRequestException('User Already exists');

    const hashedPass = await bcrypt.hash(password, 10);
    await this.userModel.create({ email, password: hashedPass, fullName });
    return 'user created successfully';
  }

  async getCurrentUser(userId: string) {
    return await this.userModel.findById(userId);
  }
}
