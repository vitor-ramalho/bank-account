import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { WhitdrawDto } from '../dto/whitdraw.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(createAccountDto);
  }

  @Patch(':id')
  whitdrawValue(@Body() amount: WhitdrawDto, @Param('id') id: number) {
    return this.accountService.withdrawAmount(+id, amount);
  }

  @Patch('deposit/:id')
  depositValue(@Body() amount: WhitdrawDto, @Param('id') id: number) {
    return this.accountService.depositAmount(+id, amount);
  }

  @Get()
  findAll() {
    return this.accountService.getAllAccounts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.getAccountById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.deleteAccount(+id);
  }
}
