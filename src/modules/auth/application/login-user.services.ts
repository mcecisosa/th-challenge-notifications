import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentialsError } from '../domain/errors/invalid-credentials.error';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { LoginResponse } from './types/login-response.type';
import { PasswordHasher } from 'src/shared/security/password-hasher.abstract';

@Injectable()
export class LoginUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasser: PasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.password) throw new InvalidCredentialsError();

    console.log('paso el primer control');

    const isMatching = await this.passwordHasser.compare(
      password,
      user.password,
    );

    if (!isMatching) throw new InvalidCredentialsError();

    console.log('paso el segundo control');

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: { id: user.id, email: user.email } };
  }
}
