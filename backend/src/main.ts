import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  //
  // const response = await (contract as any).get_user_last_guess({
  //   owner_id: 'app2.coza.testnet',
  // });

  // console.log(response, '!!!!!!!!!!!!!!!');
  // await (contract as any).ft_transfer({
  //   receiver_id: 'yunsangho.testnet',
  //   gas: '300000000000000',
  //   amount: '10000000000000',
  // }); // attached deposit in yoctoNEAR (optional));

  await app.listen(3000);
}

bootstrap();
