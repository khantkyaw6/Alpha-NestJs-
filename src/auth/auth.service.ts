import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/Login.dto';
import { PasswordUtil } from 'src/utils/password.utils';
import { RegisterUserDto } from './dto/Register.dto';

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

  async register(
    registerData: RegisterUserDto,
  ): Promise<{ isSuccess: boolean; message: string }> {
    const checkUser = await this.userRepository.findOne({
      where: { email: registerData.email },
    });

    if (checkUser)
      throw new ConflictException(
        `A user with ${checkUser.email} email already exists.`,
      );

    const hashedPassword = await PasswordUtil.hashPassword(
      registerData.password,
    );
    registerData.password = hashedPassword;
    const createUser = await this.userRepository.save(registerData);

    if (!createUser)
      throw new ConflictException('Error occur in register, Please Try Again!');

    const resObj = {
      isSuccess: true,
      message: 'User Registered successfully',
    };
    return resObj;
  }
}
