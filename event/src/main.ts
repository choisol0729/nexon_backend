import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';
import 'dotenv/config';

async function bootstrap() {
  const config = new ConfigService();
  const options = config.get('service');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    options,
  );
  await app.listen();

  Logger.log(
    `Listening from: ${JSON.stringify(options)}`,
    'bootstrap-msa',
  );
}
bootstrap();
