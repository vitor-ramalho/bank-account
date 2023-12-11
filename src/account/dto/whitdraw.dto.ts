import { IsNotEmpty, IsNumber } from 'class-validator';

export class WhitdrawDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
