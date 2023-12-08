import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';

/**
 * @description: 生成winston日志实例
 */
const generateLoggerInstance = () => {
  return createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      // 配置日志滚动
      new winston.transports.DailyRotateFile({
        level: 'warn',
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'info',
        dirname: 'logs',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ],
  });
};

const logger = WinstonModule.createLogger({
  instance: generateLoggerInstance(),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // false关闭整个nestjs日志
    // logger: ['error', 'warn'],

    // 使用winston日志代替nest内置日志，后续可直接通过import { Logger } from '@nestjs/common'使用;
    logger,
  });
  // 使用全局过滤器处理异常
  app.useGlobalFilters(
    new AllExceptionFilter(logger, app.get(HttpAdapterHost)),
  );
  await app.listen(3000);
}
bootstrap();
