import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import Profile from './profile.entity';
import Logs from 'src/logs/logs.entity';
import Roles from 'src/roles/roles.entity';

@Module({
  // 导入User实体
  imports: [TypeOrmModule.forFeature([User, Profile, Logs, Roles])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
