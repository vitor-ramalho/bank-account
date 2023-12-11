import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AccountRepository } from '../repository/account.repository';
import { Account } from '@prisma/client';
import { WhitdrawDto } from '../dto/whitdraw.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAllAccounts(): Promise<Account[]> {
    try {
      const accounts = await this.accountRepository.findAll();

      if (!accounts) {
        throw new NotFoundException('Account not found');
      }

      return accounts;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(error.message);
    }
  }

  async getAccountById(id: number): Promise<Account | undefined> {
    try {
      const account = await this.accountRepository.findById(id);

      if (!account) {
        throw new NotFoundException(`Account with id ${id} not found`);
      }

      return account;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(error.message);
    }
  }

  async createAccount(data: CreateAccountDto): Promise<Account> {
    try {
      const account = await this.accountRepository.create(data);

      return account;
    } catch (error) {
      if (
        error?.name === 'PrismaClientKnownRequestError' &&
        error?.code === 'P2002' &&
        error?.meta?.target?.includes('number')
      ) {
        throw new HttpException(
          'Account number must be unique',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  async withdrawAmount(
    id: number,
    amount: WhitdrawDto,
  ): Promise<Account | null> {
    try {
      const accountValue = await this.accountRepository.findById(id);

      if (!accountValue) {
        throw new NotFoundException(`Account with id ${id} not found`);
      }

      if (amount.amount > accountValue.balance) {
        throw new BadRequestException('Insuficient balance');
      }

      const newAccountValue = {
        ...accountValue,
        balance: accountValue.balance - amount.amount,
      };

      await this.accountRepository.update(id, newAccountValue);

      return newAccountValue;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(error.message);
    }
  }

  async depositAmount(id: number, amount: WhitdrawDto): Promise<any | null> {
    try {
      const accountValue = await this.accountRepository.findById(id);

      if (!accountValue) {
        throw new NotFoundException(`Account with id ${id} not found`);
      }

      const newAccountValue = {
        ...accountValue,
        balance: accountValue.balance + amount.amount,
      };

      return this.accountRepository.update(id, newAccountValue);
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(error.message);
    }
  }

  async deleteAccount(id: number): Promise<boolean> {
    try {
      const account = await this.accountRepository.deleteAccount(id);

      if (!account) {
        throw new NotFoundException(`Account with id ${id} not found`);
      }

      return account;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(error.message);
    }
  }
}
