import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file';

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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // false关闭整个nestjs日志
    // logger: ['error', 'warn'],

    // 使用winston日志代替nest内置日志，后续可直接通过import { Logger } from '@nestjs/common'使用;
    logger: WinstonModule.createLogger({
      instance: generateLoggerInstance(),
    }),
  });
  await app.listen(3000);
}
bootstrap();
