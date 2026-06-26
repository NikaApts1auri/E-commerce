import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'გიორგი გიორგაძე',
    description: 'მომხმარებლის სრული სახელი',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'მომხმარებლის ელ-ფოსტა',
  })
  @IsNotEmpty()
  @IsString()
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
