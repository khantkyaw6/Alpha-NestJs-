import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UpdateUserPasswordDto } from './dto/UpdateUserPassword.dto';
import { User } from './user.entity';
import { PasswordUtil } from 'src/utils/password.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async index(): Promise<{
    isSuccess: boolean;
    message: string;
    statusCode: number;
    data: User[];
  }> {
    const users = await this.userRepository.find({
      where: { isDeleted: false },
    });

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'All User list',
      data: users,
    };
  }

  async store(
    user: CreateUserDto,
  ): Promise<{ isSuccess: boolean; message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `A user with ${user.email} email already exists.`,
      );
    }

    const defaultPassword = 'helloworld';
    const hashedPassword = await PasswordUtil.hashPassword(defaultPassword);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return {
      isSuccess: true,
      message: 'User created successfully',
    };
  }

  async show(id: number): Promise<{
    isSuccess: boolean;
    message: string;
    statusCode: number;
    data: User;
  }> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'User Detail',
      data: user,
    };
  }

  async update(
    id: number,
    userData: UpdateUserDto,
  ): Promise<{ isSuccess: boolean; message: string; statusCode: number }> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, userData);

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'User updated successfully',
    };
  }

  async updatePassword(
    id: number,
    newPasswordDto: UpdateUserPasswordDto,
  ): Promise<{ isSuccess: boolean; message: string; statusCode: number }> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { newPassword, oldPassword } = newPasswordDto;
    const isMatch = await PasswordUtil.comparePassword(
      oldPassword,
      user.password,
    );

    if (!isMatch) throw new ConflictException('Old password does not match');

    user.password = await PasswordUtil.hashPassword(newPassword);
    await this.userRepository.save(user);

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'User Password Changed',
    };
  }

  async delete(
    id: number,
  ): Promise<{ isSuccess: boolean; message: string; statusCode: number }> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, { isDeleted: true });

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'User deleted successfully',
    };
  }
}
