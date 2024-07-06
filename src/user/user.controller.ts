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
  async update(@Param('id') id: number, @Body() userUpdateData: CreateUserDto) {
    return await this.userService.update(id, userUpdateData);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
}
