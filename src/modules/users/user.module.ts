import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './infrastructure/user.repository';
import { GetAllUsersService } from './application/get-all-users.service';
import { CreateUserService } from './application/create-user.service';
import { UpdateUserService } from './application/update-user.service';
import { DeleteUserService } from './application/delete-user.service';
import { SharedModule } from 'src/shared/shared.module';
import { getUserByIdService } from './application/get-by-id-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClientsModule, SharedModule],
  controllers: [UserController],
  providers: [
    UserRepository,
    GetAllUsersService,
    getUserByIdService,
    CreateUserService,
    UpdateUserService,
    DeleteUserService,
  ],
  exports: [UserRepository],
})
export class UserModule {}

//Qué hace forFeature: Registra el model, permite inyectarlo, scopeado al módulo
