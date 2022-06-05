import { Module } from '@nestjs/common';
import { GuessModule } from './guess/guess.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GuessModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
  ],
})
export class AppModule {}
