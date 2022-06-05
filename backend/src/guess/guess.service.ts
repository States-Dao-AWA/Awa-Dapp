import { BadRequestException, Injectable } from '@nestjs/common';
import { graphData, isFirst } from './guess.mocks';
import { GuessRequestDto } from './dto/guess.request';

@Injectable()
export class GuessService {
  guess(guessRequestDto: GuessRequestDto) {
    const { address, number } = guessRequestDto;

    // TODO 1-1. Is this address your first time?, We have to call the smart contract.
    if (!isFirst) {
      throw new BadRequestException('not the first time');
    }

    // TODO 1-2. Request graph data.
    const data = graphData.reduce((a, b) => a + b);

    if (!(number < data * 1.05 && number > data * 0.95)) {
      throw new BadRequestException('incorrect');
    }

    // TODO 1-3. If the error range is within 5%, reward is provided. Request contract.
    // TODO Update the status of the user's address. Request contract.
  }
}
