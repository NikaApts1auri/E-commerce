import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    example: 'recipient@example.com',
    description: 'მიმღების ელ-ფოსტა',
  })
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'გამარჯობა', description: 'იმეილის სათაური' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'ეს არის ტესტური მეილი.',
    description: 'იმეილის შინაარსი',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
