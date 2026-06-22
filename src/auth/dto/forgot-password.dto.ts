import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტის მისამართი' })
  @IsNotEmpty({ message: 'ელ-ფოსტის ველი არ უნდა იყოს ცარიელი' })
  email: string;
}
