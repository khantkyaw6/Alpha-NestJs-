import { IsEmail, IsEnum, IsNotEmpty, Length } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'User name is required',
  })
  @Length(3, 255)
  name: string;

  @IsNotEmpty({
    message: 'User email is required',
  })
  @IsEmail(
    {},
    {
      message: 'User email must be a valid email address',
    },
  )
  @Length(3, 255)
  email: string;

  @IsNotEmpty({
    message: 'User phone is required',
  })
  @Length(9, 15)
  phone: string;

  @IsNotEmpty({
    message: 'User Gender is required',
  })
  @IsEnum(['male', 'female'], {
    message: 'User gender must be either male or female',
  })
  gender: 'male' | 'female';

  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
}
