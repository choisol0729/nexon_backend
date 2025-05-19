import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const config = new ConfigService();
  const port = config.get('port');
  const host = config.get('host');

  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  
  Logger.log(
    `Listening from: http://${host}:${port}`,
    'bootstrap',
  );
}
bootstrap();