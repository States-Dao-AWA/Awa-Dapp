import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GuessRequestDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  answer: number;
}
