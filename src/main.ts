import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // false关闭整个nestjs日志
    // logger: ['error', 'warn'],
  });
  await app.listen(3000);
  Logger.log(`App 运行在：${3000}端口`);
}
bootstrap();
