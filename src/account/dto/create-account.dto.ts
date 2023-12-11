import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  ag: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsNumber()
  @IsNotEmpty()
  balance: number;
}
