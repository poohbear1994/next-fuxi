import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 定义控制台输出
        const consoleTransports = new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(`ljx's nest-demo`),
          ),
        });
        // 配置日志滚动文件
        const dailyTransports = new winston.transports.DailyRotateFile({
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
        });
        const dailyInfoTransports = new winston.transports.DailyRotateFile({
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
        });
        return {
          transports: [
            consoleTransports,
            ...(configService.get('log')['on']
              ? [dailyTransports, dailyInfoTransports]
              : []),
          ],
        };
      },
    }),
  ],
})
export class LogsModule {}
