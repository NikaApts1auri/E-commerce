import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendWelcomeNewUsersDto {
  @ApiProperty({
    example: 'new-user@example.com',
    description: 'ახალი მომხმარებლის ელ-ფოსტა',
  })
  @IsNotEmpty()
  @IsEmail()
  to: string;
}
