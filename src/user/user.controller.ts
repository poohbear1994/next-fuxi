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
import { Logger } from '@nestjs/common';

// 这里可以理解为我们routePath的pref，前缀为user时，走这个controller，'/user/xxxxx'
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    // 等效于： this.userService = UserService
    this.logger.log(`UserController init`);
  }

  /**
   * @description: 获取全部用户
   */
  // GET请求
  @Get()
  getUsers(): any {
    this.logger.log(`请求getUsers成功`);
    return this.userService.findAll();
  }

  /**
   * @description: 根据Id查询用户
   */
  @Get('byId')
  getUserById(@Query('id') id: string): any {
    return this.userService.findById(+id);
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
  adduser(
    @Body() params: { user: Partial<User>; roleIds: Array<number> },
  ): any {
    // 使用@Body从req对象中提取整个body对象
    return this.userService.create(params.user, params.roleIds);
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

  /**
   * @description: 查询用户操作日志
   */
  @Get('logs')
  getUserLogs(@Query('id') id: string) {
    return this.userService.findLogs(+id);
  }

  /**
   * @description: 查询用户角色列表
   */
  @Get('roles')
  getUserRoles(@Query('id') id: string) {
    return this.userService.findRoles(+id);
  }

  /**
   * @description: 查询用户文件
   */
  @Get('profile')
  getUserProfile(@Query('id') id: string) {
    return this.userService.findProfile(+id);
  }

  /**
   * @description: 根据结果分类获取指定用户操作日志
   */
  @Get('logsByGroup')
  getUserLogsByGroup(@Query('id') id: string) {
    return this.userService.findLogsByGroup(+id);
  }
}
