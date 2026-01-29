import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllUsersService } from './application/get-all-users.service';
import { CreateUserService } from './application/create-user.service';
import { UpdateUserService } from './application/update-user.service';
import { DeleteUserService } from './application/delete-user.service';
import { getUserByIdService } from './application/get-by-id-user.service';
import { JwtAuthGuard } from '../auth/infrastructure/jwt-auth.guard';

//sin try--catch, sin logica, sin repos

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly getAllUserService: GetAllUsersService,
    private readonly getUserByIdService: getUserByIdService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponse({
    description: 'Return all users',
    type: UserResponseDto,
    isArray: true,
  })
  async getAll() {
    const users = await this.getAllUserService.execute();
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by id',
  })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiOkResponse({
    description: 'Returns the user with the specified id',
    type: UserResponseDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.getUserByIdService.execute(id);
    return UserResponseDto.fromEntity(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The user has been succesfully created',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserService.execute(createUserDto);

    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description:
      'The user has been successfully updated with all provided fields',
    type: UserResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserService.execute(id, dto);

    return UserResponseDto.fromEntity(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiOkResponse({ description: 'The user has been succesfully deleted' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteUserService.execute(id);
  }
}
