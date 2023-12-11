import { Module } from '@nestjs/common';
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/account.repository';
import { AccountController } from './controller/account.controller';

@Module({
  imports: [AccountRepository],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService, AccountRepository],
})
export class AccountModule {}
