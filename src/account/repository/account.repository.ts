import { Account, PrismaClient } from '@prisma/client';
import { AccountRepositoryInterface } from './account.repository.interface';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

export class AccountRepository implements AccountRepositoryInterface {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  async findById(id: number): Promise<Account | undefined> {
    return this.prisma.account.findUnique({
      where: { id },
    });
  }

  async create(data: CreateAccountDto): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  async update(
    id: number,
    data: UpdateAccountDto,
  ): Promise<Account | undefined> {
    return this.prisma.account.update({
      where: { id },
      data: data,
    });
  }

  async deleteAccount(id: number): Promise<boolean> {
    const result = await this.prisma.account.delete({
      where: { id },
    });

    return !!result;
  }
}
