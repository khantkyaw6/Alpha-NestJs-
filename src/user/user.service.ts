import {
  ConflictException,
  Get,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async index(): Promise<{
    isSuccess: boolean;
    message: string;
    statusCode: Number;
    data: User[];
  }> {
    const user = await this.userRepository.find({
      where: { isDeleted: false },
    });
    const resObj = {
      isSuccess: true,
      statusCode: 200,
      message: 'All User list',
      data: user,
    };
    return resObj;
  }

  async store(user: CreateUserDto): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `A user with ${user.email} email already exists.`,
      );
    }

    const createUser = await this.userRepository.save(user);

    if (createUser) {
      const resObj = {
        isSuccess: true,
        message: 'User created successfully',
      };
      return resObj;
    }
  }

  async show(id: number): Promise<{
    isSuccess: boolean;
    message: string;
    statusCode: number;
    data: User;
  }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const resObj = {
      isSuccess: true,
      statusCode: 200,
      message: 'User Detail',
      data: user,
    };
    return resObj;
  }

  async update(
    id: number,
    userData: CreateUserDto,
  ): Promise<{
    isSuccess: boolean;
    message: string;
    statusCode: number;
  }> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, userData);

    const resObj = {
      isSuccess: true,
      statusCode: 200,
      message: 'User updated successfully',
    };
    return resObj;
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, { isDeleted: true });

    const resObj = {
      isSuccess: true,
      statusCode: 200,
      message: 'User deleted successfully',
    };
    return resObj;
  }
}
