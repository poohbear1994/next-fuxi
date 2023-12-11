import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RangeModule } from './range/range.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import configuation from './configuation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { connectionParams } from 'ormconfig';

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
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    RangeModule,
    RolesModule,
    LogsModule,
  ],
  // 此模块中定义的控制器的可选列表，这些控制器必须被实例化
  controllers: [],
  // 可选的提供商列表，它们将被Nest注入器实例化，并且至少可以在本模块中共享。
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
