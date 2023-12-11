import { Account } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

export interface AccountRepositoryInterface {
  findAll(): Promise<Account[]>;
  findById(id: number): Promise<Account | undefined>;
  update(id: number, data: UpdateAccountDto): Promise<Account | undefined>;
  create(data: CreateAccountDto): Promise<Account>;
  deleteAccount(id: number): Promise<boolean>;
}
