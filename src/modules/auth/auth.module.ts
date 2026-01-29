import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { UserModule } from '../users/user.module';
import { LoginUserService } from './application/login-user.services';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    UserModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [LoginUserService, JwtStrategy],
})
export class AuthModule {}
