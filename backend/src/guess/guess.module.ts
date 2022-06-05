import { Module } from '@nestjs/common';
import { GuessController } from './guess.controller';
import { GuessService } from './guess.service';
import { Contract } from '../contract/contract.class';
import { TransferContract } from '../contract/transfer-contract.class';

@Module({
  controllers: [GuessController],
  providers: [GuessService, Contract, TransferContract],
})
export class GuessModule {}
