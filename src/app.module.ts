import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RangeModule } from './range/range.module';
import { ConfigModule } from '@nestjs/config';

// 将应用程序的不同部分组织成独立的模块，每个模块具有明确的职责和功能
@Module({
  // 可选的已导入模块列表，用于导出该模块中所需的提供程序。
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    RangeModule,
  ],
  // 此模块中定义的控制器的可选列表，这些控制器必须被实例化
  controllers: [],
  // 可选的提供商列表，它们将被Nest注入器实例化，并且至少可以在本模块中共享。
  providers: [],
})
export class AppModule {}
