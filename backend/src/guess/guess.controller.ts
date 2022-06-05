import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessRequestDto } from './dto/guess.request';

@Controller('guess')
export class GuessController {
  constructor(private readonly guessSevice: GuessService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async guess(@Body() guessRequestDto: GuessRequestDto) {
    return this.guessSevice.guess(guessRequestDto);
  }
}
