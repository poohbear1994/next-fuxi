import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RangeModule } from './range/range.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuation from './configuation';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { LoggerModule } from 'nestjs-pino';
// import { join } from 'path';
import User from './user/user.entity';
import Profile from './user/profile.entity';
import Logs from './logs/logs.entity';
import Roles from './roles/roles.entity';

// 将应用程序的不同部分组织成独立的模块，每个模块具有明确的职责和功能
@Global()
@Module({
  // 可选的已导入模块列表，用于导出该模块中所需的提供程序。
  imports: [
    // 导入环境变量配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      // 读取指定文件的环境配置
      // envFilePath: envFilePath,
      load: [configuation],
      ignoreEnvFile: true,
    }),
    // 导入数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { host, password, port, username, database } =
          configService.get('db');
        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: [User, Profile, Logs, Roles],
          // 同步本地的schema与数据库 => 初始化的时候使用
          synchronize: true,
          logging: true,
        };
      },
    }),
    // 注册pino Logger模块
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport: {
    //       targets: [
    //         {
    //           target: 'pino-pretty',
    //           options: {
    //             colorize: true,
    //           },
    //         },
    //         {
    //           target: 'pino-roll',
    //           options: {
    //             // 日志生成位置
    //             file: join('logs', 'log.txt'),
    //             // 滚动频率
    //             frequency: 'daily',
    //             // 文件大小超过多少时滚动
    //             size: '10240k',
    //             mkdir: true,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // }),
    UserModule,
    RangeModule,
    RolesModule,
  ],
  // 此模块中定义的控制器的可选列表，这些控制器必须被实例化
  controllers: [],
  // 可选的提供商列表，它们将被Nest注入器实例化，并且至少可以在本模块中共享。
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
