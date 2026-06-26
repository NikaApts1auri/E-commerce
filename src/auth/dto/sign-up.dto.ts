import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'მომხმარებლის ელ-ფოსტა',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'პაროლი (6-20 სიმბოლო)' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @ApiProperty({ example: 'გიორგი გიორგაძე' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ required: false, enum: ['user'] })
  @IsOptional()
  @IsIn(['user'], { message: 'Role can only be user' })
  role?: string;
}
