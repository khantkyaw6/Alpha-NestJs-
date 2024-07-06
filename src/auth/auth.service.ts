import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/Login.dto';
import { PasswordUtil } from 'src/utils/password.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(loginData: LoginUserDto): Promise<{
    isSuccess: boolean;
    message: string;
    data: User;
  }> {
    const checkUser = await this.userRepository.findOne({
      where: { email: loginData.email },
    });

    if (!checkUser)
      throw new NotFoundException(
        `User with the email of ${loginData.email} not found`,
      );

    const isCorrectPassword = await PasswordUtil.comparePassword(
      loginData.password,
      checkUser.password,
    );

    if (!isCorrectPassword)
      throw new UnauthorizedException('Password Incorrect');

    const resObj = {
      isSuccess: true,
      message: 'Login Successfuly',
      data: checkUser,
    };
    return resObj;
  }
}
