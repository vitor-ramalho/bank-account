import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
