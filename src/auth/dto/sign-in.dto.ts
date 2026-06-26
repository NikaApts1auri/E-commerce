import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'მომხმარებლის ელ-ფოსტის მისამართი',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'მომხმარებლის პაროლი (6-დან 20 სიმბოლომდე)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
}
