// account.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/account.repository';
import { Account, AccountType } from '@prisma/client';
import { WhitdrawDto } from './dto/whitdraw.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';

describe('AccountService', () => {
  let accountService: AccountService;
  let accountRepository: AccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: AccountRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            withdrawAmount: jest.fn(),
            depositAmount: jest.fn(),
            deleteAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    accountRepository = module.get<AccountRepository>(AccountRepository);
  });

  it('should get all accounts', async () => {
    const accounts: Account[] = [
      {
        id: 1,
        number: 123,
        ag: 'ABC',
        balance: 100,
        type: AccountType.POUPANCA,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    jest.spyOn(accountRepository, 'findAll').mockResolvedValue(accounts);

    const result = await accountService.getAllAccounts();

    expect(result).toEqual(accounts);
  });

  it('should get an account by id', async () => {
    const account: Account = {
      id: 1,
      number: 123,
      ag: 'ABC',
      balance: 100,
      type: AccountType.POUPANCA,
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(accountRepository, 'findById').mockResolvedValue(account);

    const result = await accountService.getAccountById(1);

    expect(result).toEqual(account);
  });

  it('should create an account', async () => {
    const createAccountDto = {
      id: 1,
      number: 123,
      ag: 'ABC',
      balance: 100,
      type: AccountType.CORRENTE,
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(accountRepository, 'create').mockResolvedValue(createAccountDto);

    const result = await accountService.createAccount(createAccountDto);

    expect(result).toEqual(createAccountDto);
  });

  it('should withdraw an amount from an account', async () => {
    const accountId = 1;
    const amount: WhitdrawDto = { amount: 2 };
    const existingAccount: Account = {
      id: 1,
      number: 123,
      ag: 'ABC',
      balance: 100,
      type: AccountType.POUPANCA,
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest
      .spyOn(accountRepository, 'findById')
      .mockResolvedValue(existingAccount);
    jest.spyOn(accountRepository, 'update').mockResolvedValue({
      ...existingAccount,
      balance: existingAccount.balance - amount.amount,
    });

    const result = await accountService.withdrawAmount(accountId, amount);

    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(accountRepository.update).toHaveBeenCalledWith(accountId, {
      ...existingAccount,
      balance: existingAccount.balance - amount.amount,
    });
    expect(result).toEqual({
      ...existingAccount,
      balance: existingAccount.balance - amount.amount,
    });
  });

  it('should deposit an amount into an account', async () => {
    const accountId = 1;
    const amount: WhitdrawDto = { amount: 50 };
    const updatedAccount: Account = {
      id: 1,
      number: 123,
      ag: 'ABC',
      balance: 100,
      type: AccountType.POUPANCA,
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(accountRepository, 'findById').mockResolvedValue(updatedAccount);
    jest.spyOn(accountRepository, 'update').mockResolvedValue({
      ...updatedAccount,
      balance: updatedAccount.balance + amount.amount,
    });

    const result = await accountService.depositAmount(accountId, amount);

    expect(result).toEqual({
      ...updatedAccount,
      balance: updatedAccount.balance + amount.amount,
    });
  });
  it('should delete an account', async () => {
    const accountId = 1;
    jest.spyOn(accountRepository, 'deleteAccount').mockResolvedValue(true);

    const result = await accountService.deleteAccount(accountId);

    expect(result).toBe(true);
  });

  //EXCEPTION TESTS
  it('should throw BadRequestException if amount is greater than balance', async () => {
    const accountId = 1;
    const amount: WhitdrawDto = { amount: 150 };
    const existingAccount: Account = {
      id: 1,
      number: 123,
      ag: 'ABC',
      balance: 100,
      type: AccountType.POUPANCA,
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest
      .spyOn(accountRepository, 'findById')
      .mockResolvedValue(existingAccount);

    await expect(
      accountService.withdrawAmount(accountId, amount),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if repository create fails', async () => {
    const accountData = {
      id: 1,
      number: 123,
      ag: '',
      balance: 100,
      type: AccountType.POUPANCA,
    };

    jest.spyOn(accountRepository, 'create').mockImplementationOnce(() => {
      throw new Error('Simulated repository create failure');
    });

    try {
      await accountService.createAccount(accountData);
      fail('The createAccount function should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Simulated repository create failure');
    }
  });

  it('should throw BadRequest if account number already exists', async () => {
    const accountData = {
      id: 1,
      number: 123,
      ag: '',
      balance: 100,
      type: AccountType.POUPANCA,
    };

    try {
      await accountService.createAccount(accountData);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('ag should not be empty');
    }
  });

  it('should handle unique constraint violation and throw HttpException', async () => {
    const createAccountDto: CreateAccountDto = {
      number: 123,
      ag: 'ABC',
      type: 'CORRENTE',
      balance: 100,
    };

    // Mock the repository's create method to throw a known PrismaClientKnownRequestError
    const prismaError = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2002',
      meta: {
        modelName: 'Account',
        target: ['number'],
      },
    };
    jest.spyOn(accountRepository, 'create').mockRejectedValue(prismaError);

    // Expect the service to throw an HttpException with status 409 (Conflict)
    await expect(
      accountService.createAccount(createAccountDto),
    ).rejects.toThrow(
      new HttpException('Account number must be unique', HttpStatus.CONFLICT),
    );

    expect(accountRepository.create).toHaveBeenCalledWith(createAccountDto);
  });

  it('should throw BadRequestException if missing ag in account creation', async () => {
    const account = {
      id: 1,
      number: 123,
      ag: '',
      balance: 100,
      type: AccountType.POUPANCA,
    };

    try {
      await accountService.createAccount(account);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('ag should not be empty');
    }
  });

  it('should throw BadRequestException if missing balance in account creation', async () => {
    const account = {
      id: 1,
      number: 123,
      ag: 'as6769',
      balance: null,
      type: AccountType.POUPANCA,
    };

    try {
      await accountService.createAccount(account);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('balance should not be empty');
    }
  });

  it('should throw BadRequestException if missing account type in account creation', async () => {
    const account = {
      id: 1,
      number: 123,
      ag: 'as6769',
      balance: 123,
      type: null,
    };

    try {
      await accountService.createAccount(account);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual(
        'type must be one of the following values: POUPANCA, CORRENTE',
      );
    }
  });

  it('should throw NotFoundException if account not found', async () => {
    const accountId = 1;
    const amount: WhitdrawDto = { amount: 150 };
    jest.spyOn(accountRepository, 'findById').mockResolvedValue(undefined);
    jest.spyOn(accountRepository, 'findAll').mockResolvedValue([]);

    await expect(
      Promise.all([
        accountService.getAccountById(accountId),
        accountService.deleteAccount(accountId),
        accountService.depositAmount(accountId, amount),
        accountService.withdrawAmount(accountId, amount),
      ]),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if all accounts not found', async () => {
    jest.spyOn(accountRepository, 'findAll').mockResolvedValue(undefined);

    await expect(accountService.getAllAccounts()).rejects.toThrow(
      NotFoundException,
    );
  });
});
