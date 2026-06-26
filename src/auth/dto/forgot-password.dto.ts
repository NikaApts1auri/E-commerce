import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'მომხმარებლის ელ-ფოსტა',
  })
  @IsEmail({}, { message: 'გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტის მისამართი' })
  @IsNotEmpty({ message: 'ელ-ფოსტის ველი არ უნდა იყოს ცარიელი' })
  email: string;
}
