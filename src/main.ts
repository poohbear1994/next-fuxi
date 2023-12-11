import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import 'winston-daily-rotate-file';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用winston日志模块取代nest的内置日志模块
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 使用全局过滤器处理异常
  app.useGlobalFilters(
    new AllExceptionFilter(Logger, app.get(HttpAdapterHost)),
  );
  await app.listen(3000);
}
bootstrap();
