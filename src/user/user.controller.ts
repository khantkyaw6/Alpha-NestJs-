import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UpdateUserPasswordDto } from './dto/UpdateUserPassword.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async index() {
    return await this.userService.index();
  }

  @Get('/:id')
  async show(@Param('id') id: number) {
    return await this.userService.show(id);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  async store(@Body() userData: CreateUserDto) {
    return await this.userService.store(userData);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async update(@Param('id') id: number, @Body() userUpdateData: UpdateUserDto) {
    return await this.userService.update(id, userUpdateData);
  }

  @Patch('/:id/password')
  @UsePipes(ValidationPipe)
  async updatePassword(
    @Param('id') id: number,
    @Body() newPasswordData: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(id, newPasswordData);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
}
