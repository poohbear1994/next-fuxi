import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import User from './user.entity';

// 这里可以理解为我们routePath的pref，前缀为user时，走这个controller，'/user/xxxxx'
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    // 等效于： this.userService = UserService
  }

  /**
   * @description: 获取全部用户
   */
  // GET请求
  @Get()
  getUsers(): any {
    return this.userService.findAll();
  }

  /**
   * @description: 根据用户名查询用户
   */
  // GET请求
  @Get('byName')
  getUserByName(@Query('username') username: string): any {
    return this.userService.find(username);
  }

  /**
   * @description: 添加用户
   */
  @Post()
  adduser(@Body() params: Partial<User>): any {
    // 使用@Body从req对象中提取整个body对象
    return this.userService.create(params);
  }

  /**
   * @description: 更新用户信息
   */
  @Put()
  updateUser(@Body() params: { id: number; user: Partial<User> }): any {
    const { id, user } = params;
    return this.userService.update(id, user);
  }

  /**
   * @description: 删除用户信息
   */
  @Delete()
  deleteUser(@Query('id') id: string) {
    return this.userService.remove(+id);
  }
}
