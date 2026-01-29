import { Module } from '@nestjs/common';
import { BcryptPasswordHasherImpl } from './security/bcrypt-password-hasher.impl';
import { PasswordHasher } from './security/password-hasher.abstract';

@Module({
  providers: [
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasherImpl,
    },
  ],
  exports: [PasswordHasher],
})
export class SharedModule {}
