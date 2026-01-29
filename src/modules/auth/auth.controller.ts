import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-user-response.dto';

import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserService } from './application/login-user.services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUserUseCase: LoginUserService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({
    description: 'The user has been succesfully logged in',
    type: LoginResponseDto,
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.loginUserUseCase.execute(
      loginUserDto.email,
      loginUserDto.password,
    );
  }
}
