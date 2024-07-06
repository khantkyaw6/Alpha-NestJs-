import { IsNotEmpty, Length } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: 'New Password is required',
  })
  @Length(4, 30, {
    message: 'Password must be between 4 and 20 characters',
  })
  newPassword: string;

  @IsNotEmpty({
    message: 'Old Password is required',
  })
  oldPassword: string;
}
