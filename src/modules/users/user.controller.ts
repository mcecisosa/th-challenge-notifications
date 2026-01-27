import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserWithPokemonResponseDto } from './dto/user-with-pokemon-response.dto';
import { GetUserByIdWithPokemonUseCase } from './application/use-cases/get-by-id-user-with-pokemon.use-case';
import { UpdatePokemonIdsDto } from './dto/update-pokemon-ids.dto';
import { UserWithPokemonIdsResponseDto } from './dto/user-with-pokemon-ids-response.dto';
import { UpdatePokemonIdsUseCase } from './application/use-cases/update-pokemon-ids.use-case';

//sin try--catch, sin logica, sin repos

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly getAllUserUseCase: GetAllUsersUseCase,
    private readonly getUserByIdWithPokemonUseCase: GetUserByIdWithPokemonUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updatePokemonIdsUseCase: UpdatePokemonIdsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponse({
    description: 'Return all users',
    type: UserResponseDto,
    isArray: true,
  })
  GetAll() {
    return this.getAllUserUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by idwith their Pokemon details including names',
  })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiOkResponse({
    description:
      'Returns the user with the specified id and their Pokemon details (including names) fetched from the Pokemon API',
    type: UserWithPokemonResponseDto,
  })
  GetById(@Param('id', ParseIntPipe) id: number) {
    return this.getUserByIdWithPokemonUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The user has been succesfully created',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    console.log('controller createUserDto:', createUserDto);
    const userData = {
      ...createUserDto,
      pokemonIds: createUserDto.pokemonIds || [],
    };
    console.log('userData del controller:', userData);
    const user = await this.createUserUseCase.execute(userData);

    return UserResponseDto.fromEntity(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user including their Pokemon IDs' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description:
      'The user has been successfully updated with all provided fields including Pokemon IDs if provided',
    type: UserResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserUseCase.execute(id, dto);

    return UserResponseDto.fromEntity(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiOkResponse({ description: 'The user has been succesfully deleted' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }

  @Put(':id/pokemon')
  async updatePokemonIds(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePokemonIdsDto,
  ): Promise<UserWithPokemonIdsResponseDto> {
    const user = await this.updatePokemonIdsUseCase.execute(id, dto.pokemonIds);

    return UserWithPokemonIdsResponseDto.fromEntity(user);
  }
}
