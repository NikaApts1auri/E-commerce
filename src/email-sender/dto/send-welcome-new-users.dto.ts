import { isEmail, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SendEmailDto } from './send-email.dto';
import { OmitType } from '@nestjs/mapped-types';

export class SendWelcomeNewUsersDto {
  @IsNotEmpty()
  @IsEmail()
  to: string;
}
