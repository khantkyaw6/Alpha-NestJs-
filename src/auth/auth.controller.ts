import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/Login.dto';
import { RegisterUserDto } from './dto/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginData: LoginUserDto) {
    return await this.authService.login(loginData);
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerData: RegisterUserDto) {
    return await this.authService.register(registerData);
  }
}
